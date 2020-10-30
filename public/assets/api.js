const cuisineType = $('#cuisineType').val()
const intolerance = $('#intolerance').val()
const foodItem = $('#foodItem').val()

function searchRecipe() {
    let cuisine = `cuisine=${cuisineType}`
    let intolerances = `&intolerances=${intolerance}`
    let food = `&query=${foodItem}`
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://webknox-recipes.p.rapidapi.com/recipes/search?" + `${cuisine}` + `${intolerances}` + 'offset=0&number=10' + `${food}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "webknox-recipes.p.rapidapi.com",
            "x-rapidapi-key": "b5a492aa05msh6869ac7f6671576p14fe03jsn3366a114fc88"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        const results = response.results
        for (let i = 0; i < results.length; i++) {
            $('#').append(`
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

// $('').text(results[i].title)
// $('').text(response.baseUri + results[i].image)
// $('').text(results[i].readyInMinutes)
// $('').text(results[i].servings)
// $('').text(results[i].sourceUrl)