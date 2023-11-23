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
  searchedContent.innerHTML = "";

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
  try {
    const response = await fetch(`${searUrlApi}?beer_name=${searchWord}&page=${currentPage}&per_page=${beersPerPage}`);
    if (!response.ok) {
      throw new Error(`HTTP Error!: ${response.status}`);
    }  
    const beers = await response.json();
    if (beers.length === 0) {
      displayNoResults();
    } else {
      displayBeerList(beers);
      updatePageDisplay();
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
  imgBox.innerHTML = "<p>No image!!!</p>";
}


function displayBeer(beer) {
  searchedContent.innerHTML = "";
  const beerElement = document.createElement('p');
  beerElement.classList.add('one-beer');
  beerElement.innerHTML = beer.name;
  beerElement.addEventListener('click', () =>  {
    displayBeerDetails(beer);
  });
  searchedContent.appendChild(beerElement);
}

function displayBeerList(beers) {
  searchedContent.innerHTML = "";

  const beerList = document.createElement('ul');
  beerList.classList.add('beer-list');

  beers.forEach(beer => { 
    const beerItem = document.createElement('li');
    beerItem.textContent = beer.name;
    beerItem.addEventListener('click', () =>  {
      clearSelectedLi();
      markSelectedLi(beerItem);
      displayBeerDetails(beer);
    });
    beerList.appendChild(beerItem);

  });
  searchedContent.appendChild(beerList);
};

function updatePageDisplay() {
  const totalPages = Math.ceil(beersPerPage / currentPage);
  currentPageSpan.textContent = `${currentPage} / ${totalPages}`;
}

function displayBeerDetails(beer) {
  imgBox.innerHTML = "";
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
}

function markSelectedLi(beerItem) {
  beerItem.classList.add('selected');
}


function setupButtonListeners() {
  infoBtn.addEventListener("click", async () => {
    const selectedBeerName = beerName.textContent;
    descriptionBox.innerHTML= "";
    
    try {
      const response = await fetch(`${searUrlApi}?beer_name=${selectedBeerName}`);
      if (!response.ok) {
        throw new Error(`HTTP Error!: ${response.status}`);
      }
      const beers = await response.json();
      if (beers.length > 0) {
        const selectedBeer = beers[0];

        // Display volume information in descriptionBox
        const volumeInfo = `
          <p>Description: ${selectedBeer.description}</p>
          <p>Volume: ${selectedBeer.volume.value} ${selectedBeer.volume.unit}</p>
          <p>ABV: ${selectedBeer.abv}%</p>
          <p>IBU: ${selectedBeer.ibu}</p>
          <p>Tagline: ${selectedBeer.tagline}</p>
        `;
        descriptionBox.innerHTML = volumeInfo;
        
       
      

        // Handle other additional information or actions
        console.log("Additional Info for", selectedBeerName, ":", selectedBeer);
      }
    } catch (error) {
      console.log("Error fetching additional info:", error);
    }
  });
}

setupButtonListeners();