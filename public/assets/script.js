let loginUser = '';
let action, loginData;

let loginForm = $(`<div style="position: absolute; top: 80px; right: 80px; width: 200px; height: 200px; border: 3px solid pink;">
    <div class="m-2">
      <label for="loginUsername">Username</label><br>
      <input type="text" id="loginUsername" placeholder="username"><br>
      <label for="loginPassword">Password</label><br>
      <input type="password" id="loginPassword" placeholder="password"><br>
      <button type="submit" onClick="handleLogin(event)">Login</button>
      <div id="loginStatus">&nbsp;</div>
    </div>
  </div>`);
loginForm.hide().appendTo(document.body);

function clearLoginForm() {
    loginForm.find('input').val('');
    loginForm.find('#loginStatus').text('');
}

function popUpSignUp(evt) {
    evt.preventDefault();
    clearLoginForm();
    action = evt.target.textContent.trim();
    console.log(`[popUpSignUp] action='${action}'`);
    // change button text to 'SignUp'
    loginForm.find('button').text('Sign Up');
    loginForm.show();
}

function popUpLogin(evt) {
    evt.preventDefault();
    clearLoginForm();
    action = evt.target.textContent.trim();
    console.log(`[popUpLogin] action='${action}'`);
    if (action == 'Logout') {
        console.log('Changing to Login');
        $('#login').text('Login');
    } else {
        // change button text to 'Login'
        loginForm.find('button').text('Login');
        loginForm.show();
    }
}

function NewUser() { // Create new user
    $.post('/api/user', loginData, function (result) {
        $('#loginStatus').text(result.message);
        loginUser = result.userId;
        console.log(`[NewUser] userId=${loginUser}`);
        $('#login').text('Logout');
        setTimeout(() => loginForm.hide(), 1000);
    });
}

function Login() {
    // Login user
    $.post('/api/userAuth', loginData)
        .done(function (result) {
            console.log('[login] success.', result);
            $('#loginStatus').text(result.message);
            loginUser = result.userId;
            console.log(`[Login] userId=${loginUser}`);
            $('#login').text('Logout');
            setTimeout(() => loginForm.hide(), 1000);
        })
        .fail(function(result) {
            console.log('[login] failure.');
            //$('#loginStatus').text(result.responseJSON.message);
            $('#loginStatus').text('Login Failed.');
            setTimeout(() => loginForm.hide(), 1000);
        });
}

function handleLogin(evt) {
    evt.preventDefault();
    console.log('[handleLogin]');
    loginData = {
        username: `${$('#loginUsername').val()}`,
        password: `${$('#loginPassword').val()}`
    };
    if (action==='Sign Up') {
        NewUser();
    } else if (action==='Login') {
        Login();
    }
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

$('#signup').on('click', popUpSignUp);
$('#login').on('click', popUpLogin);
$('#postbtn').on('click', NewRecipe);
$('#homeTitle').on('click', AllRecipes);
$('#homeTitle').on('click', UserRecipes);
$('#deleteBtn').on('click', DelRecipes);