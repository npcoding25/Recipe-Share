let loginUser = ''

$('#signUp').on('click', NewUser())
$('#login').on('click', Login())
$('#postbtn').on('click', NewRecipe())
$('#homeTitle').on('click', AllRecipes())
$('#homeTitle').on('click', UserRecipes())
$('#deleteBtn').on('click', DelRecipes())

function NewUser() { // Create new user

    let username = $('#loginUsername')
    let password = $('#loginPassword')
    data = {
        username: `${username}`,
        password: `${password}`
    };
    $.post('/api/user', data, function (result) { // Optionally display message
        loginUser = result.insertId
    });
}

function Login() {
    // Login user
    $.post('/api/userAuth', data, function (result) { // Optionally display message
        loginUser = result.insertId
    });
}


function NewRecipe() {

    const newRecipeTitle = $('#exampleFormControlInput2')
    const newRecipeDescription = $('#exampleFormControlTextarea1')
    const newRecipeUrl = $('.recipeURL')
    const newRecipeImage = $('.imageURL')
    // Post another recipe.
    data = {
        title: `${newRecipeTitle}`,
        description: `${newRecipeDescription}`,
        sourceUrl: `${newRecipeUrl}`,
        imageUrl: `${newRecipeImage}`
    };
    userId = loginUser;
    $.post(`/api/recipe/${userId}`, data, function (result) { // Optionally display message
        recipeId = result.insertId; // save for delete
    });
}

function AllRecipes() {

    // Get all recipes
    $.get('/api/recipe', function (result) {
        result.forEach(recipe => {
            let curhtml = $('#apiCall').html();
            $('#apiCall').prepend(curhtml += `           
            <div class="card" style="width: 18rem;">
              <h5 class="card-title">${recipe.title}</h5>
              <img src="${recipe.imageUrl}" class="card-img-top" alt="...">
              <div class="card-body">
                <p class="card-text">${recipe.description}</p>
                <a href="${recipe.sourceUrl}" class="btn btn-primary">Go somewhere</a>
              </div>
            </div>
            `);
        });
    });
}

function UserRecipes() {
    // Get recipes by user
    userId = loginUser;
    $.get(`/api/recipe/${userId}`, function (result) {
        result.forEach(recipe => {
            let curhtml = $('#apiCall').html();
            $('#apiCall').prepend(curhtml += `
        <div class="card" style="width: 18rem;">
            <h5 class="card-title">${recipe.title}</h5>
            <img src="${recipe.imageUrl}" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">${recipe.description}</p>
                <a href="${recipe.sourceUrl}" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        `);
        });
    });
}

function DelRecipe() {
    // Optional: delete recipe
    $.ajax({
        url: `/api/recipe/${recipeId}`,
        method: 'DELETE'
    }).then(function (result) { // Optionally display message
        console.log(result)
    });
}