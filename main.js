const searUrlApi = 'https://api.punkapi.com/v2/beers';
const input = document.getElementById('site-search');
const searchButton = document.getElementById('search-btn');
const searchedContent = document.getElementById('searched-content');
const randomBeerButton = document.getElementById('random-beer-btn');
const searchedNavigation = document.getElementById('searched-navigation');
const resultBox = document.getElementById('result-box');
const imgBox = document.getElementById('img-box');
const beerName = document.getElementById('beer-name');
const descriptionBox = document.getElementById('description-box');
const infoBtn = document.getElementById('info-btn');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const beerImage = document.getElementById('image');
const infobtn = document.getElementById('info-btn');
let selectedLi = null;
const beersPerPage = 10;
let currentPage = 1;
let displayedBeers = [];

searchButton.addEventListener('click', () => {
  const searchWord = input.value.trim();
  if (searchWord !== '') {
    searchBeer(searchWord);
  } else {
    getRandomBeer();
  }
});

randomBeerButton.addEventListener('click', getRandomBeer);

async function getRandomBeer() {
  searchedContent.textContent = "";

  try {
    const response = await fetch(`${searUrlApi}/random`);
    if (!response.ok) {
      throw new Error(`HTTP Error!: ${response.status}`);
    }
    const beer = await response.json();
    console.log("Random Beer:", beer);
    displayBeer(beer[0]);
  } catch (error) {
    console.log("Error fetching message :", error);
  }
}

async function searchBeer (searchWord) {
  searchedContent.textContent = "";
  try {
    const response = await fetch(`${searUrlApi}?beer_name=${searchWord}&page=${currentPage}&per_page=${beersPerPage}`);
    if (!response.ok) {
      throw new Error(`HTTP Error!: ${response.status}`);
    }  
    const result = await response.json();
    displayedBeers = result;
    if (displayedBeers.length === 0) {
      displayNoResults();
    } else {
      displayBeerList(displayedBeers);
      updatePageDisplay(displayedBeers.length);
      setupClickListener();
    }
}   
catch (error) {
  console.log("Error fetching message :", error);
  }
}

function displayNoResults() {
  searchedContent.innerHTML = "<p>No results found for the given search term.</p>";
}

function displayNoImage() {
  imgBox.textContent = ""; // 
  const noImagePlaceholder = document.createElement('img');
  noImagePlaceholder.src = 'https://as2.ftcdn.net/v2/jpg/00/89/55/15/1000_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg'; // Provide the path to your default image
  noImagePlaceholder.alt = 'No Image';
  imgBox.appendChild(noImagePlaceholder);
}

function displayBeer(beer) {
  searchedContent.textContent = "";
  const beerElement = document.createElement('p');
  beerElement.classList.add('one-beer');
  beerElement.textContent = beer.name;
  beerElement.addEventListener('click', () =>  {
    displayBeerDetails(beer);
    descriptionBox.textContent= "";
  });
  searchedContent.appendChild(beerElement);
}

function displayBeerList(beers) {
  searchedContent.textContent = "";

  const beerList = document.createElement('ul');
  beerList.classList.add('beer-list');

  beers.forEach(beer => { 
    const beerItem = document.createElement('li');
    beerItem.textContent = beer.name;
    beerItem.addEventListener('click', () =>  {
      descriptionBox.textContent= "";
      clearSelectedLi();
      markSelectedLi(beerItem);
      displayBeerDetails(beer);
    });
    beerList.appendChild(beerItem);

  });
  searchedContent.appendChild(beerList);
};

function updatePageDisplay(totalBeers) {
  const totalPages = Math.ceil(totalBeers / beersPerPage);
  console.log(`beers ${totalBeers}, beers per page ${beersPerPage}, current page ${currentPage}, total pages ${totalPages}`);
  currentPageSpan.textContent = `${currentPage} / ${totalPages}`;
  return totalPages;
}

function displayBeerDetails(beer) {
  imgBox.textContent = "";
  if (beer.image_url !==null && beer.image_url !=="") { 
  beerImage.src = beer.image_url;
  imgBox.appendChild(beerImage);
} else {
  displayNoImage();
}
  beerName.textContent = beer.name;
  console.log(beer);
}

function clearSelectedLi() {
  const liElements = document.querySelectorAll('.beer-list li');
  liElements.forEach(li => {
    li.classList.remove('selected');
  });
};

function markSelectedLi(beerItem) {
  beerItem.classList.add('selected');
}

function setupButtonListeners() {
  infoBtn.addEventListener("click", async () => {
    const selectedBeerName = beerName.textContent;
    descriptionBox.textContent= "";
    
    try {
      const response = await fetch(`${searUrlApi}?beer_name=${selectedBeerName}`);
      if (!response.ok) {
        throw new Error(`HTTP Error!: ${response.status}`);
      }
      const beers = await response.json();
      if (beers.length > 0) {
        const selectedBeer = beers[0];

        // Display volume information in descriptionBox
        const displayHops = selectedBeer.ingredients.hops.map(hop => hop.name).join(', ');
        const displayMalt = selectedBeer.ingredients.malt.map(malt => malt.name).join(', ');

        const volumeInfo = `
          <p>Description: ${selectedBeer.description}</p>
          <p>Volume: ${selectedBeer.volume.value} ${selectedBeer.volume.unit}</p>
          <p>ABV: ${selectedBeer.abv}%</p>
          <p>Malt: ${displayMalt}</p>
          <p>Hops: ${displayHops}</p>
          <p>Food paring: ${selectedBeer.food_pairing}</p>
          <p>Brew Tips: ${selectedBeer.brewers_tips}</p>
        `;
        descriptionBox.innerHTML = volumeInfo;
        console.log("Additional Info for", selectedBeerName, ":", selectedBeer);
      }
    } catch (error) {
      console.log("Error fetching additional info:", error);
    }
  });
}

setupButtonListeners();

nextPageButton.addEventListener('click', async () => {
  currentPage++;
  await searchBeer(input.value.trim());
  const totalPages = updatePageDisplay(displayedBeers.length);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
});

prevPageButton.addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    await searchBeer(input.value.trim());
    updatePageDisplay(displayedBeers.length);
  }
});