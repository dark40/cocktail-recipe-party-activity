// Function to provide search functionality to search bar

const container = document.createElement('div');

var form = document.querySelector(".searchBar");
function handleDataFromAPI(data) {
  cardCocktail.innerHTML = "";
  const randomDrink = data.drinks[0]
  const drinkName = randomDrink.strDrink
  const instructions = `<span class="textWeight">Instructions: </span>${randomDrink.strInstructions}`
  const drinkImg = randomDrink.strDrinkThumb

  // get ingredients
  const wantedIngredients = []
  for (let i = 1; i < 16; i++) {
    const key = 'strIngredient' + i
    const ingredient = randomDrink[key]
    // console.log(ingredient)
    if (ingredient) {
      wantedIngredients.push(ingredient)
    }
  }

  // get measure
  const wantedMeasure = []
  for (let i = 1; i < 16; i++) {
    const key2 = 'strMeasure' + i
    const measure = randomDrink[key2]
    // console.log(measure)
    if (measure) {
      wantedMeasure.push(measure)
    }
  }

  // get ingredientsArray
  let ingredientsArray = []
  for (let i = 0; i < wantedIngredients.length; i++) {
    ingredientsArray.push(wantedMeasure[i])
    ingredientsArray.push(wantedIngredients[i])
  }

  // remove odd comma
  let ingredients = ingredientsArray.toString()
  // console.log(ingredients)
  let list = ingredients.split(',')
  let newIngredients = ''
  for (let i = 0; i < list.length; i++) {
    let comma
    if (i % 2 !== 0) {
      comma = ''
      if (i === 0) {
        comma = ''
      }
      newIngredients += comma + list[i]
    } else {
      comma = ','
      if (i === 0) {
        comma = ''
      }
      newIngredients += comma + list[i]
    }
  }

  // replace comma with comma and space
  const ingredientsStr = newIngredients.replaceAll(',', ', ')
  // change string to array
  const newIngredientsArray = ingredientsStr.split(', ')

  // random img element
  let createRandomImg = document.createElement('img')
  createRandomImg.src = drinkImg
  createRandomImg.alt = drinkName
  createRandomImg.classList.add('card-img-cocktail')
  // random drink name
  let createRandomDrinkName = document.createElement('h3')
  createRandomDrinkName.textContent = drinkName
  // cearte a div for text-align
  let createRandomDiv = document.createElement('div')
  createRandomDiv.classList.add('align_left')

  // random instructions
  let createRandomInstructions = document.createElement('p')
  createRandomInstructions.innerHTML = instructions

  let createBr = document.createElement('br')

  // create ingredentList
  let createIngredentList = document.createElement('p')
  createIngredentList.innerHTML = `<span class="textWeight">Ingredients: </span>`

  // append element
  cardCocktail.classList.add('card-cocktail')
  cardCocktail.appendChild(createRandomImg)
  cardCocktail.appendChild(createRandomDrinkName)
  cardCocktail.appendChild(createBr)
  cardCocktail.appendChild(createRandomDiv)
  createRandomDiv.appendChild(createIngredentList)

  // loot the ingredient string and get each value
  let ingredientList = ''
  for (let i = 0; i < newIngredientsArray.length; i++) {
    ingredientList = newIngredientsArray[i]
    // console.log(ingredientList)
    const showIngredients = `<ul class="ingredient-list">
              <li>${ingredientList}</li>
              </ul>`
    // create random ingredients element
    let createRandomIngredients = document.createElement('p')
    createRandomIngredients.innerHTML = showIngredients
    // append
    createRandomDiv.appendChild(createRandomIngredients)
  }
  // createRandomDiv.appendChild(createRandomIngredients)
  createRandomDiv.appendChild(createRandomInstructions)
}

function hidePrevResult() {
  if (recipeResult.classList.contains('hide')) {
    recipeResult.classList.remove('hide');
  }

  // Checks if random gallery is not hidden, add hide
  if (!randomEleHolder.classList.contains('hide')) {
    randomEleHolder.classList.add('hide');
  }
}

function handleSubmit(event) {
  event.preventDefault()

  // display the jokes.
  displayJokes();

  hidePrevResult();

  // console.log("submitted")
  var userInput = form.inputBox.value
  var serachNameUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${userInput}`
  fetch(serachNameUrl)
    .then(function (response) {
      var res = response.json()
      return res
    })
    .then(function (data) {
      if (data.drinks) {
        storeHistory(userInput);
      }


      displayHistory();
      handleDataFromAPI(data);

    })
    // When there is an error, call openModalInvalid function that prompts user about invalid search input
    .catch(error => {
      openModalInvalid();
    });
}

form.addEventListener("submit", handleSubmit);

/**
 * Search History code start from here
 */

let searchHistory = $("#searchHistory");
let drink;

function handleClickonHistory() {

  // Display jokes. 
  displayJokes();

  drink = $(this).text();
  hidePrevResult();
  var serachNameUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
  fetch(serachNameUrl)
    .then(function (response) {
      var res = response.json()
      return res
    })
    .then(function (data) {
      handleDataFromAPI(data);
    })

}

function storeHistory(history) {
  if (history) {
    let historyList = (localStorage.getItem("cocktail-history") === null) ? [] : JSON.parse(localStorage.getItem("cocktail-history"));

    if (!historyList.includes(history)) {
      historyList = [...historyList, history];
    }
    localStorage.setItem("cocktail-history", JSON.stringify(historyList));
  }
}

function displayHistory() {
  let historyList = JSON.parse(localStorage.getItem("cocktail-history"));
  searchHistory.empty();

  if (historyList) {
    for (let i = 0; i < historyList.length; i++) {
      let historyItemEl = $("<div class='block'></div>");
      let historySpanEl = $("<span class='tag is-info button is-light is-medium is-rounded'>" + historyList[i] + "</span>");
      let deleteBtnEl = $("<button class='delete is-small'></button>");
      deleteBtnEl.click(handleDelete);
      historySpanEl.append(deleteBtnEl);
      historyItemEl.append(historySpanEl);
      historyItemEl.click(handleClickonHistory);

      searchHistory.append(historyItemEl);
    }
  }
}

function handleDelete(e) {
  e.stopPropagation();
  let history = $(this).parent().text();
  let historyList = JSON.parse(localStorage.getItem("cocktail-history"));
  historyList = historyList.filter(element => element !== history);
  localStorage.setItem("cocktail-history", JSON.stringify(historyList));
  $(this).parent().remove();
}

displayHistory();

/**
 * Search History code end at here
 */

var allCocktailNames = []
var allUrls = [
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=c",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=b",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=d",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=e",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=f",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=g",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=h",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=i",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=j",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=k",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=l",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=m",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=n",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=o",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=p",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=q",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=r",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=s",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=t",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=v",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=w",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=y",
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=z",
]

getAllNames()
// Function to get all cocktail names and put them into an array
function getAllNames() {
  // For loop to fetch each url searching by first letter
  for (i = 0; i < allUrls.length; i++) {
    var firstLetterSearch = allUrls[i]

    fetch(firstLetterSearch)
      .then(function (response) {
        const res = response.json()
        return res
      })
      .then(function (data) {
        const array = data['drinks']
        // For each individual url letter search, get name of each cocktail
        for (i = 0; i < array.length; i++) {
          const drinkName = data['drinks'][i]['strDrink']
          // Append name of cocktail to allCocktailNames
          allCocktailNames.push(drinkName);
        }
      })
  }
}

var recipeResult = document.querySelector(".recipeResult")

// Function for autocomplete cocktail search
$(function () {
  var availableCocktails = allCocktailNames;
  $("#userInput").autocomplete({
    source: availableCocktails
  });
});

// Cocktails---Variable

let randomEleHolder = document.querySelector('#randomEleHolder')
const cardCocktail = document.querySelector('#card-cocktail')
// Random button---Variable
const randomBtn = document.querySelector('#randomBtn')


// Cocktails---function for random drinks for every 8sec
// remove time gap


getRandom()
// function for getRandom data and render when click
function getRandom() {

  const randomUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  fetch(randomUrl)
    .then(function (response) {
      // console.log(response.json())
      const res = response.json()
      // console.log(res)
      return res
    })
    .then(function (data) {
      // console.log(data)
      // get values 

      randomEleHolder.innerHTML = ''
      container.innerHTML = "";

      const randomDrink = data.drinks[0]
      const drinkName = randomDrink.strDrink
      const instructions = `<span class="textWeight">Instructions: </span>${randomDrink.strInstructions}`
      const drinkImg = randomDrink.strDrinkThumb
      const drinkID = randomDrink.idDrink

      // get ingredients
      const wantedIngredients = []
      for (let i = 1; i < 16; i++) {
        const key = 'strIngredient' + i
        const ingredient = randomDrink[key]
        // console.log(ingredient)
        if (ingredient) {
          wantedIngredients.push(ingredient)
        }
      }
      // console.log(wantedIngredients)

      // get measure
      const wantedMeasure = []
      for (let i = 1; i < 16; i++) {
        const key2 = 'strMeasure' + i
        const measure = randomDrink[key2]
        // console.log(measure)
        if (measure) {
          wantedMeasure.push(measure)
        }
      }
      // console.log(wantedMeasure)

      // get ingredientsArray
      let ingredientsArray = []
      for (let i = 0; i < wantedIngredients.length; i++) {
        ingredientsArray.push(wantedMeasure[i])
        ingredientsArray.push(wantedIngredients[i])
      }
      // console.log(ingredientsArray)

      // remove odd comma
      let ingredients = ingredientsArray.toString()
      // console.log(ingredients)
      let list = ingredients.split(',')
      let newIngredients = ''
      for (let i = 0; i < list.length; i++) {
        let comma
        if (i % 2 !== 0) {
          comma = ''
          if (i === 0) {
            comma = ''
          }
          newIngredients += comma + list[i]
        } else {
          comma = ','
          if (i === 0) {
            comma = ''
          }
          newIngredients += comma + list[i]
        }
      }
      // console.log(newIngredients)
      // replace comma with comma and space
      const ingredientsStr = newIngredients.replaceAll(',', ', ')
      // change string to array
      const newIngredientsArray = ingredientsStr.split(', ')
      // console.log(newIngredientsArray)

      // add event listener to random display
      // when click on randomEleHolder, it will rander search result by ID



      container.addEventListener('click', function () {



        randomEleHolder.classList.add('hide')
        recipeResult.classList.remove('hide')
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`
        fetch(url)
          .then(function (response) {
            // console.log(response.json())
            const res = response.json()
            // console.log(res)
            return res
          })
          .then(function (data) {
            // console.log(data)
            // rander data into card

            // random img element
            cardCocktail.innerHTML = ''
            let createRandomImg = document.createElement('img')
            createRandomImg.src = drinkImg
            createRandomImg.alt = drinkName
            createRandomImg.classList.add('card-img-cocktail')
            // random drink name
            let createRandomDrinkName = document.createElement('h3')
            createRandomDrinkName.textContent = drinkName
            // cearte a div for text-align
            let createRandomDiv = document.createElement('div')
            createRandomDiv.classList.add('align_left')

            // random instructions
            let createRandomInstructions = document.createElement('p')
            createRandomInstructions.innerHTML = instructions

            let createBr = document.createElement('br')

            // create ingredentList
            let createIngredentList = document.createElement('p')
            createIngredentList.innerHTML = `<span class="textWeight">Ingredients: </span>`

            // append element
            cardCocktail.classList.add('card-cocktail')
            cardCocktail.appendChild(createRandomImg)
            cardCocktail.appendChild(createRandomDrinkName)
            cardCocktail.appendChild(createBr)
            cardCocktail.appendChild(createRandomDiv)
            createRandomDiv.appendChild(createIngredentList)

            // loot the ingredient string and get each value
            let ingredientList = ''
            for (let i = 0; i < newIngredientsArray.length; i++) {
              ingredientList = newIngredientsArray[i]
              // console.log(ingredientList)
              const showIngredients = `<ul class="ingredient-list">
              <li>${ingredientList}</li>
              </ul>`
              // create random ingredients element
              let createRandomIngredients = document.createElement('p')
              createRandomIngredients.innerHTML = showIngredients
              // append
              createRandomDiv.appendChild(createRandomIngredients)
            }
            // createRandomDiv.appendChild(createRandomIngredients)
            createRandomDiv.appendChild(createRandomInstructions)
          })
      })


      randomEleHolder.append(container)
      // random img
      let createRandomImg = document.createElement('img')
      createRandomImg.src = drinkImg
      createRandomImg.alt = drinkName
      createRandomImg.classList.add('randomImg')
      // random drink name
      let createRandomDrinkName = document.createElement('h3')
      createRandomDrinkName.textContent = drinkName
      // append element
      container.appendChild(createRandomImg)
      container.appendChild(createRandomDrinkName)
    })
}

// Set timer for getRandom()  
let timer = setInterval(function () {
  // before getRandom(), clone randomEleHolder
  // to get rid of exisiting event listener
  const cloned = randomEleHolder.cloneNode(true);
  // replace existing randomELeHolder with cloned
  randomEleHolder.parentNode.replaceChild(cloned, randomEleHolder);
  randomEleHolder.remove();
  randomEleHolder = cloned;
  getRandom();
}, 5000)


// mouse over, stop timer
randomEleHolder.addEventListener('mouseenter', function () {
  clearInterval(timer)
})

// mouse leave, start timer
randomEleHolder.addEventListener('mouseleave', function () {
  timer = setInterval(getRandom, 5000)
})

// -------------------------------------------------------------

// add event listener for button

randomBtn.addEventListener('click', function (e) {
  e.preventDefault()

  // prevent multiple click
  randomBtn.setAttribute("disabled", "true")
  let i = 2
  let timer = setInterval(function () {
    i--
    if (i === 0) {
      clearInterval(timer)
      randomBtn.disabled = false
    }
  }, 1000)

  // Display the jokes.
  displayJokes();

  // Checks if recipe results have class 'hide' if so remove
  if (recipeResult.classList.contains('hide')) {
    recipeResult.classList.remove('hide');
  }
  randomEleHolder.classList.add('hide')
  const randomUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  fetch(randomUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      // get values 
      cardCocktail.innerHTML = ''
      const randomDrink = data.drinks[0]
      const drinkName = randomDrink.strDrink
      const instructions = `<span class="textWeight">Instructions: </span>${randomDrink.strInstructions}`
      const drinkImg = randomDrink.strDrinkThumb
      const drinkID = randomDrink.idDrink

      // get ingredients
      const wantedIngredients = []
      for (let i = 1; i < 16; i++) {
        const key = 'strIngredient' + i
        const ingredient = randomDrink[key]
        // console.log(ingredient)
        if (ingredient) {
          wantedIngredients.push(ingredient)
        }
      }

      // get measure
      const wantedMeasure = []
      for (let i = 1; i < 16; i++) {
        const key2 = 'strMeasure' + i
        const measure = randomDrink[key2]
        // console.log(measure)
        if (measure) {
          wantedMeasure.push(measure)
        }
      }

      // get ingredientsArray
      let ingredientsArray = []
      for (let i = 0; i < wantedIngredients.length; i++) {
        ingredientsArray.push(wantedMeasure[i])
        ingredientsArray.push(wantedIngredients[i])
      }

      // remove odd comma
      let ingredients = ingredientsArray.toString()
      // console.log(ingredients)
      let list = ingredients.split(',')
      let newIngredients = ''
      for (let i = 0; i < list.length; i++) {
        let comma
        if (i % 2 !== 0) {
          comma = ''
          if (i === 0) {
            comma = ''
          }
          newIngredients += comma + list[i]
        } else {
          comma = ','
          if (i === 0) {
            comma = ''
          }
          newIngredients += comma + list[i]
        }
      }

      // replace comma with comma and space
      const ingredientsStr = newIngredients.replaceAll(',', ', ')
      // change string to array
      const newIngredientsArray = ingredientsStr.split(', ')

      // random img element
      let createRandomImg = document.createElement('img')
      createRandomImg.src = drinkImg
      createRandomImg.alt = drinkName
      createRandomImg.classList.add('card-img-cocktail')
      // random drink name
      let createRandomDrinkName = document.createElement('h3')
      createRandomDrinkName.textContent = drinkName
      // cearte a div for text-align
      let createRandomDiv = document.createElement('div')
      createRandomDiv.classList.add('align_left')

      // random instructions
      let createRandomInstructions = document.createElement('p')
      createRandomInstructions.innerHTML = instructions

      let createBr = document.createElement('br')

      // create ingredentList
      let createIngredentList = document.createElement('p')
      createIngredentList.innerHTML = `<span class="textWeight">Ingredients: </span>`

      // append element
      cardCocktail.classList.add('card-cocktail')
      cardCocktail.appendChild(createRandomImg)
      cardCocktail.appendChild(createRandomDrinkName)
      cardCocktail.appendChild(createBr)
      cardCocktail.appendChild(createRandomDiv)
      createRandomDiv.appendChild(createIngredentList)

      // loot the ingredient string and get each value
      let ingredientList = ''
      for (let i = 0; i < newIngredientsArray.length; i++) {
        ingredientList = newIngredientsArray[i]
        // console.log(ingredientList)
        const showIngredients = `<ul class="ingredient-list">
              <li>${ingredientList}</li>
              </ul>`
        // create random ingredients element
        let createRandomIngredients = document.createElement('p')
        createRandomIngredients.innerHTML = showIngredients
        // append
        createRandomDiv.appendChild(createRandomIngredients)
      }
      // createRandomDiv.appendChild(createRandomIngredients)
      createRandomDiv.appendChild(createRandomInstructions)
    })
})


container.addEventListener('click', displayJokes);



// Random Jokes function
function randomJokes() {
  const jokesURL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

  fetch(jokesURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {

      showJokes(data);
    })
    .catch(console.err);

};

function showJokes(obj) {

  let jokeEl = document.querySelector(".randomJokeDisplay");

  jokeEl.replaceChildren();

  let joke = document.createElement("p");
  joke.innerHTML = obj.joke || [];

  let jokeSetup = document.createElement("p");
  jokeSetup.innerHTML = obj.setup || [];

  let jokeDelivery = document.createElement("p");
  jokeDelivery.innerHTML = obj.delivery || [];

  jokeEl.append(jokeSetup, jokeDelivery, joke);
}


// Set time interval for showing jokes every 5 seconds.

var loop = false;

function displayJokes() {

  if (loop === false) {

    randomJokes();

    setInterval(randomJokes, 5000);
    
    loop = true; 

}}



// Adding JS trigger for modal
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

// Function to open modal
function openModalInvalid() {
  var triggerModal = document.getElementById("modal-invalid")
  triggerModal.classList.add('is-active')
  form.inputBox.value = "";
}

// Function to refresh page when home button is clicked
var homeButton = document.getElementById("homeButton")
homeButton.addEventListener("click", function() {
  window.location.reload();
})