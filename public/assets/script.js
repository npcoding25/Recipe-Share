let loginUser = localStorage.loginUser || '';
let action, loginData;

let loginForm = $(`<div style="position: absolute; top: 80px; right: 80px; height: 200px; border: 3px solid pink;">
    <div class="m-2" style="background-color: #ffe6e6;">
      <label for="loginUsername">Username</label><br>
      <input type="text" id="loginUsername" placeholder="username"><br>
      <label for="loginPassword">Password</label><br>
      <input type="password" id="loginPassword" placeholder="password"><br>
      <button type="submit" onClick="handleLogin(event)">Login</button>
      <div id="loginStatus" style="background-color: #ffe6e6;">&nbsp;</div>
    </div>
  </div>`);
loginForm.hide().appendTo(document.body);

function clearLoginForm() {
    loginForm.find('input').val('');
    loginForm.find('#loginStatus').html('&nbsp;');
}

function NewUser() { // Create new user
    $.post('/api/user', loginData, function (result) {
        $('#loginStatus').text(result.message);
        loginUser = result.userId;
        localStorage.loginUser = loginUser;
        console.log(`[NewUser] userId=${loginUser}`);
        $('#login').text('Logout');
        setTimeout(() => loginForm.hide(), 1000);
        UserRecipes();
    });
}

function Login() {
    // Login user
    $.post('/api/userAuth', loginData)
        .done(function (result) {
            console.log('[login] success.', result);
            $('#loginStatus').text(result.message);
            loginUser = result.userId;
            localStorage.loginUser = loginUser;
            console.log(`[Login] userId=${loginUser}`);
            $('#login').text('Logout');
            setTimeout(() => loginForm.hide(), 1000);
            UserRecipes();
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
    console.log('[NewRecipe]')
    const newRecipeTitle = $('#exampleFormControlInput2').val()
    const newRecipeDescription = $('#exampleFormControlTextarea1').val()
    const newRecipeUrl = $('.recipeURL').val()
    const newRecipeImage = $('.imageURL').val()
    // Post another recipe.
    data = {
        title: `${newRecipeTitle}`,
        description: `${newRecipeDescription}`,
        sourceUrl: `${newRecipeUrl}`,
        imageUrl: `${newRecipeImage}`
    };
    userId = loginUser;
    if (userId) {
        $.post(`/api/recipe/${userId}`, data, function (result) { // Optionally display message
            // go back to main page
            window.location.href = '/';
        });
    } else {
        alert('Please login first!');
        // go back to main page
        window.location.href = '/';
    }
}

function AllRecipes() {
    console.log('[AllRecipes]');
    // Get all recipes
    $.get('/api/recipe', function (result) {
        $('#apiCall').html('');
        result.forEach(recipe => {
            $('#apiCall').prepend(`           
            <div class="card" style="width: 18rem;">
              <h5 class="card-title">${recipe.title}</h5>
              <img src="${recipe.imageUrl}" class="card-img-top" alt="...">
              <div class="card-body">
                <p class="card-text">${recipe.description}</p>
                <a href="${recipe.sourceUrl}" class="btn btn-primary">See Recipe</a>
              </div>
            </div>
            `);
        });
    });
}

function UserRecipes() {
    console.log('[UserRecipes]');
    // Get recipes by user
    userId = loginUser;
    $.get(`/api/recipe/${userId}`, function (result) {
        $('#apiCall').html('');
        result.forEach(recipe => {
            $('#apiCall').prepend(`
        <div class="card" style="width: 18rem;">
            <h5 class="card-title">${recipe.title}</h5>
            <img src="${recipe.imageUrl}" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">${recipe.description}</p>
                <a href="${recipe.sourceUrl}" class="btn btn-primary">See Recipe</a>
                <button onClick="DelRecipe(${recipe.recipe_id})" class="btn btn-primary">Delete</button>
            </div>
        </div>
        `);
        });
    });
}

function DelRecipe(recipeId) {
    // Optional: delete recipe
    $.ajax({
        url: `/api/recipe/${recipeId}`,
        method: 'DELETE'
    }).then(function (result) { // Optionally display message
        UserRecipes();
    });
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
    if (action === 'Logout') {
        loginUser = '';
        localStorage.removeItem('loginUser');
        console.log('Changing to Login');
        $('#login').text('Login');
        AllRecipes();
    } else {
        // change button text to 'Login'
        loginForm.find('button').text('Login');
        loginForm.show();
    }
}

$('#signup').on('click', popUpSignUp);
$('#login').on('click', popUpLogin);
$('#postbtn').on('click', NewRecipe);
$('#homeTitle').on('click', AllRecipes);
$('#homeTitle').on('click', UserRecipes);
$('#deleteBtn').on('click', DelRecipe);

if (loginUser) {
    $('#login').text('Logout');
    UserRecipes();
} else {
    AllRecipes();
}