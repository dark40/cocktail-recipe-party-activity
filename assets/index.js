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
  randomEleHolder.innerHTML = ''
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
      const container = document.createElement('div');
      container.addEventListener('click', function () {
        cardCocktail.innerHTML = ''
        randomEleHolder.classList.add('hide')
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
      createRandomDrinkName.classList.add('setPaddingTop')
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
}, 8000)

// mouse over, stop timer
randomEleHolder.addEventListener('mouseenter', function () {
  clearInterval(timer)
})

// mosue leave, start timer
randomEleHolder.addEventListener('mouseleave', function () {
  timer = setInterval(getRandom, 8000)
})

// -------------------------------------------------------------

// add event listener for button
randomBtn.addEventListener('click', function (e) {
  e.preventDefault()
  cardCocktail.innerHTML = ''
  randomEleHolder.classList.add('hide')
  const randomUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  fetch(randomUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      // get values 
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







