/* CONTROLLER FOLDER ========================================
The controller is the logical related to interaction and
'controlling' behaviour. In our serer-side code, the only
real controller elements are the 'router', so we create a
router folder
====================================================== */

const ormFunctions = require('../models/recipe.js');
const passwordHash = require('password-hash');

function router(app) {
    // User endpoints
    // POST /api/user -> addUser(username, password)
    app.post('/api/user', async function(req, res) {
        console.log('[POST /api/user] we received this data:', req.body);
        // Using async/await
        // const result = await orm.addUser(req.body.username,
        //     passwordHash.generate(req.body.password));
        // // console.log(`[POST /api/user] insertId: ${result.insertId}`);
        // res.send({ insertId: result.insertId, message: 'Registered successfully' });
        // Using Callbacks
        let hashedPswd = passwordHash.generate(req.body.password);
        ormFunctions.insertUser(['username','password'],
            [req.body.username, hashedPswd],
            //[req.body.username, req.body.password],
            (result) => res.send({ userId: result.insertId, message: 'User added!' }));
    });

    // POST /api/userAuth -> getUser(username) then compare
    app.post('/api/userAuth', async function(req, res) {
        console.log('[POST /api/userAuth] we received this data:', req.body);
        // Using async/await
        // const result = await orm.getUser(req.body.username);
        // if (passwordHash.verify(req.body.password, result.password)) {
        //     res.send({ message: 'User Authenticated' });
        // } else {
        //     res.status(401).send({ message: 'User Authentication failed' });
        //     console.log('[POST /api/userAuth] Authentication failed.');
        // }
        // Using Callbacks
        ormFunctions.selectUser(`username='${req.body.username}'`, (result) => {
            console.log('[selectUser]', result);
            // if (req.body.password === result[0].password) {
            if (passwordHash.verify(req.body.password, result[0].password)) {
                res.json({ message: 'User Authenticated', userId: result[0].id });
            } else {
                res.status(401).send({ message: 'User Authentication failed' });
                console.log('[POST /api/userAuth] Authentication failed.');
            }
        });
    });

    // DELETE /api/user/:id
    app.delete('/api/user/:id', async function(req, res) {
        const userId = req.params.id
        ormFunctions.deleteUser('id', userId,
            (result) => res.send({ message: 'User Deleted' }));
    });

    // Recipe endpoints
    // GET /api/recipe -> getAllRecipes()
    app.get('/api/recipe', async function(req, res) {
        // console.log(`[GET /api/recipe]`, req.body);
        // Using await/async
        // const result = await orm.getAllRecipes();
        // res.send(result);
        // Using callback
        ormFunctions.selectAllRecipes( (result) => res.send(result) );
    });

    // GET /api/recipe/:user -> getUserRecipes(userId)
    app.get('/api/recipe/:user', async function(req, res) {
        // console.log(`[GET /api/recipe]`);
        // Using await/async
        // const result = await orm.getUserRecipes(req.params.user);
        // res.send(result);
        // Using callback
        ormFunctions.selectAllRecipes( (result) => {
            let resultUserId = result.filter( row => row.user_id === parseInt(req.params.user));
            res.send(resultUserId);
        });
    });

    // POST /api/recipe/:user -> addRecipe(userId, recipe)
    app.post('/api/recipe/:user', async function(req, res) {
        console.log('[POST /api/recipe/:user] we received this data:', req.body);
        // ToDo: Extract recipe from body
        let userId = req.params.user;
        let { title, description, sourceUrl, imageUrl } = req.body;
        // Using async/await
        // const result = await orm.addRecipe(req.body.userId, { title, description, sourceUrl, imageUrl });
        // res.send({ insertId: result.insertId, message: 'Recipe added!' });
        // Using callbacks
        ormFunctions.insertRecipe(['title','user_id','description','sourceUrl','imageUrl'],
            [title, userId, description, sourceUrl, imageUrl],
            (result) => res.send({ insertId: result.insertId, message: 'Recipe added!' }));
    });

    // DELETE /api/recipe/:id
    app.delete('/api/recipe/:id', async function(req, res) {
        const recipeId = req.params.id
        // console.log(`[DELETE /api/recipe/:id] id=${recipeId}`);
        // Using async/await
        // const deleteResult = await orm.deleteRecipe(recipeId);
        // res.send({ message: 'Recipe Deleted' });
        ormFunctions.deleteRecipe('recipe_id', recipeId,
            (result) => res.send({ message: 'Recipe Deleted' }));
    });

    app.get('/api/apiKey', async function(req, res) {
        const apiKey = process.env.API_KEY
        res.send(apiKey)
    })
}

module.exports = router