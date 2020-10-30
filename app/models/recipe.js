// Import the ORM to create functions that will interact with the database.
const orm = require("orm.js");

const ormFunctions = {
    selectAllRecipes: function(cb) {
        orm.getAll("recipe", (res) => {
            cb(res);
        });
    },

    selectAllUsers: function(cb) {
        orm.getAll("user", (res) => {
            cb(res);
        });
    },
    //select one recipe
    selectRecipe: function(condition, cb) {
        orm.getOne("recipe", condition, (res) => {
            cb(res);
        });
    },
    //select one user
    selectUser: function(condition, cb) {
        orm.getOne("user", condition, (res) => {
            cb(res);
        });
    },
    // The variables cols and vals are arrays.
    insertRecipe: function(cols, vals, cb) {
        orm.addOne("recipe", cols, vals, (res) => {
            cb(res);
        });
    },
    // insert one user
    insertUser: function(cols, vals, cb) {
        orm.addOne("user", cols, vals, (res) => {
            cb(res);
        });
    },

    updateUser: function(objColVals, condition, cb) {
        orm.updateOne("user", objColVals, condition, (res) => {
            cb(res);
        });
    },
    updateRecipe: function(objColVals, condition, cb) {
        orm.updateOne("recipe", objColVals, condition, (res) => {
            cb(res);
        });
    },
    deleteRecipe: function(cols, vals, cb) {
        orm.deleteOne("recipe", cols, vals, (res) => {
            cb(res);
        });
    },
    deleteUser: function(cols, vals, cb) {
        orm.deleteOne("user", cols, vals, (res) => {
            cb(res);
        });
    }
};

module.exports = ormFunctions;