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
            $('#apiCall').append(`
            <div class="card" style="width: 18rem;">
                <h5 class="card-title">${results[i].title}</h5>
                <img src="${response.baseUri + results[i].image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text">Estimated time: ${results[i].readyInMinutes} min</p>
                    <p class="card-text"> Servings: ${results[i].servings}
                    <a href="${results[i].sourceUrl}" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            `)
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
                    $('#apiCall').append(`
                    <div class="card" style="width: 18rem;">
                        <h5 class="card-title">${response.title}</h5>
                        <img src="${response.image}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <p class="card-text">Estimated time: ${response.readyInMinutes} min</p>
                            <p class="card-text"> Servings: ${response.servings}
                            <a href="${response.sourceUrl}" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                    `)
                });
            }
            getRecipeInfo()
        }

    });
}