/* CONTROLLER FOLDER ========================================
The controller is the logical related to interaction and
'controlling' behaviour. In our serer-side code, the only
real controller elements are the 'router', so we create a
router folder
====================================================== */

const orm = require('../models/orm');
const passwordHash = require('password-hash');

function router(app) {
    // User endpoints
    // POST /api/user -> addUser(username, password)
    app.post('/api/user', async function (req, res) {
        // console.log('[POST /api/user] we received this data:', req.body);
        const result = await orm.addUser(req.body.username,
            passwordHash.generate(req.body.password));
        // console.log(`[POST /api/user] insertId: ${result.insertId}`);
        res.send({insertId: result.insertId, message: 'Registered successfully'});
    });

    // POST /api/userAuth -> getUser(username) then compare
    app.post('/api/userAuth', async function (req, res) {
        // console.log('[POST /api/userAuth] we received this data:', req.body);
        const result = await orm.getUser(req.body.username);
        if (passwordHash.verify(req.body.password, result.password)) {
            res.send({message: 'User Authenticated'});
        } else {
            res.status(401).send({message: 'User Authentication failed'});
            console.log('[POST /api/userAuth] Authentication failed.');
        }
    });

    // Recipe endpoints
    // GET /api/recipe -> getAllRecipes()
    app.get('/api/recipe', async function (req, res) {
        // console.log(`[GET /api/recipe]`, req.body);
        const result = await orm.getAllRecipes();
        res.send(result);
    });

    // GET /api/recipe/:user -> getUserRecipes(userId)
    app.get('/api/recipe/:user', async function (req, res) {
        // console.log(`[GET /api/recipe]`);
        const result = await orm.getUserRecipes(req.params.user);
        res.send(result);
    });

    // POST /api/recipe/:user -> addRecipe(userId, recipe)
    app.post('/api/recipe/:user', async function (req, res) {
        console.log('[POST /api/recipe] we received this data:', req.body);
        // ToDo: Extract recipe from body
        let {title, description, sourceUrl, imageUrl} = req.body;
        const result = await orm.addRecipe(req.body.userId, {title, description, sourceUrl, imageUrl});
        res.send({insertId: result.insertId, message: 'Recipe added!'});
    });

    // DELETE /api/recipe/:id
    app.delete('/api/recipe/:id', async function (req, res) {
        const recipeId = req.params.id
        // console.log(`[DELETE /api/recipe/:id] id=${recipeId}`);
        const deleteResult = await orm.deleteRecipe(recipeId);
        res.send({message: 'Recipe Deleted'});
    });
}

module.exports = router