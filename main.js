const searUrlApi = 'https://api.punkapi.com/v2/beers/'
const input = document.getElementById('site-search');
const inputButton = document.querySelector('#search-box > button');


inputButton.addEventListener ('click',() => {
    console.log(input.value);
    console.log(typeof input.value);
})

async function getRandomBeer() {
  content.innerHTML = "";

  try {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    if (!response.ok) {
      throw new Error(`HTTP Error!: ${response.status}`);
    }
    const beer = await response.json();
  } catch (error) {
    console.log("Error fetching message :", error);
  }
}



async function searchBeer (searchBeer) {
  try {
    const response = await fetch(`${searUrlApi}`);
    if (!response.ok) {
      throw new Error(`HTTP Error!: ${response.status}`);
    }  
    const beers = await response.json(); 
}   
catch (error) {
  console.log("Error fetching message :", error);
}
}
