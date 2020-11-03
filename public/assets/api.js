let cuisineType = $('#cuisineType').val()
let intolerance = $('#intolerance').val()
let foodItem = $('#foodItem').val()
let ingredientItem = $('#ingredientItems')


$('#searchBtn').on("click", function (event) {
    searchRecipe()
})


function searchRecipe() {
    cuisineType = $('#cuisineType').val()
    intolerance = $('#intolerance').val()
    foodItem = $('#foodItem').val()
    const cuisine = (cuisineType == 'all') ? '' : `&cuisine=${cuisineType}`
    const intolerances = (intolerance == 'none') ? '' : `&intolerances=${intolerance}`
    const food = `&query=${foodItem}`
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://webknox-recipes.p.rapidapi.com/recipes/search?offset=0&number=10" + `${cuisine}` + `${intolerances}` + `${food}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "webknox-recipes.p.rapidapi.com",
            "x-rapidapi-key": "b5a492aa05msh6869ac7f6671576p14fe03jsn3366a114fc88"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response)
        const results = response.results
        for (let i = 0; i < results.length; i++) {

            let newCard = $(`
            <div class="card" style="width: 18rem;">
                <h5 id class="card-title">${results[i].title}</h5>
                <img src="${response.baseUri + results[i].image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text">Estimated time: ${results[i].readyInMinutes} min</p>
                    <p class="card-text"> Servings: ${results[i].servings}
                    <a href="${results[i].sourceUrl}" class="btn btn-primary">See Recipe</a>
                </div>
                <button id="saveRecipe" onClick="saveRecipe(event)">Save Recipe</button>
            </div>
            `)

            let recipe = {
                title: results[i].title,
                description: `Estimated time: ${results[i].readyInMinutes} min<br>Servings: ${results[i].servings}`,
                sourceUrl: results[i].sourceUrl,
                imageUrl: response.baseUri + results[i].image
            };

            newCard.find('button').data(recipe);
            $('#apiCall').prepend(newCard);
        }
    });
}

$('#searchBtnIngredients').on("click", function (event) {
    console.log(foodItem)

    searchRecipeIngredients()
})

function searchRecipeIngredients() {
    ingredientItem = $('#ingredientItems').val()
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=10&ranking=1&ignorePantry=false&ingredients=" + `${ingredientItem}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "b5a492aa05msh6869ac7f6671576p14fe03jsn3366a114fc88"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);

        for (let i = 0; i < response.length; i++) {
            let recipeId = response[i].id

            function getRecipeInfo() {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + `${recipeId}` + "/information",
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                        "x-rapidapi-key": "b5a492aa05msh6869ac7f6671576p14fe03jsn3366a114fc88"
                    }
                }

                $.ajax(settings).done(function (response) {
                    console.log(response);
                    let newCard = $(`
                    <div class="card" style="width: 18rem;">
                        <h5 class="card-title">${response.title}</h5>
                        <img src="${response.image}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <p class="card-text">Estimated time: ${response.readyInMinutes} min</p>
                            <p class="card-text"> Servings: ${response.servings}
                            <a href="${response.sourceUrl}" class="btn btn-primary">See Recipe</a>
                        </div>
                        <button id="saveRecipe" onClick="saveRecipe(event)">Save Recipe</button>
                    </div>
                    `);
                    let recipe = {
                        title: response.title,
                        description: `Estimated time: ${response.readyInMinutes} min<br>Servings: ${response.servings}`,
                        sourceUrl: response.sourceUrl,
                        imageUrl: response.image
                    };
                    newCard.find('button').data(recipe);
                    $('#apiCall').prepend(newCard);
                });
            }
            getRecipeInfo()
        }

    });
}

function saveRecipe(event) {
    event.preventDefault();
    let recipe = $(event.target).data();
    let userId = localStorage.loginUser || '';
    console.log(`[saveRecipe]`, recipe, userId);
    if (userId) {
        $.post(`/api/recipe/${userId}`, recipe, function (result) {
            alert('Recipe Saved!');
        });
    }
}