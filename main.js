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

async function searchBeer {
    
}
