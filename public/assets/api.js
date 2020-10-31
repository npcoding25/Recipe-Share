let cuisineType = $('#cuisineType').val()
let intolerance = $('#intolerance').val()
let foodItem = $('#foodItem').val()



$('#searchBtn').on("click", function(event) {

    console.log(foodItem)
    console.log(cuisineType)
    console.log(intolerance)
    searchRecipe()
})

function searchRecipe() {
    cuisineType = $('#cuisineType').val()
    intolerance = $('#intolerance').val()
    foodItem = $('#foodItem').val()
    const cuisine = `&cuisine=${cuisineType}`
    const intolerances = `&intolerances=${intolerance}`
    const food = `&query=${foodItem}`
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://webknox-recipes.p.rapidapi.com/recipes/search?offset=0&number=10" + `${cuisine}` + `${intolerances}`+ `${food}`,
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
// $('#searchBtn').on("click", function(event) {
//     searchRecipe()
//     event.preventDefault()
// })




// $('').text(results[i].title)
// $('').text(response.baseUri + results[i].image)
// $('').text(results[i].readyInMinutes)
// $('').text(results[i].servings)
// $('').text(results[i].sourceUrl)