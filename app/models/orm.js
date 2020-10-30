/* ORM FOLDER ========================================
We abstract our database and information-modelling code
into this section
====================================================== */

const db = require('../config/connection.js')
    // an external npm package we are using
const moment = require('moment')

/*
function getUserRecipes(criteria = { user_id }) {
    return db.query('SELECT * FROM tasks ' + (criteria ? 'WHERE ? ' : ''), criteria)
}

function addRecipe(recipe_id, frequency, title, user_id, description, createdAt) {
    if (frequency === '') {
        frequency = 'primary'
    }
    if (createdAt === '') {
        createdAt = moment().format('YYYY-MM-DD')
    }

    console.log(' inserting recipe data: ', { recipe_id, frequency, title, user_id, description, createdAt })
    return db.query('INSERT INTO recipe SET ? ', { recipe_id, frequency, title, user_id, description, createdAt })
}

function updateTask(id, priority, info, due) {
    return db.query('UPDATE tasks SET ? WHERE id=?', [{ priority, info, due }, id])
}

function deleteRecipe(recipe_id) {
    return db.query('DELETE FROM recipe WHERE id=?', [recipe_id])
}

module.exports = {
    getList,
    insertTask,
    updateTask,
    deleteTask
}
*/

function printQuestionMarks(num) {
    const arr = [];

    for (let i = 0; i < num; i++) {
        arr.push("?");
    }
    return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
    const arr = [];

    // loop through the keys and push the key/value as a string int arr
    for (let key in ob) {
        let value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
            if (typeof value === "string" && value !== true && value !== false && value !== "true" && value !== "false") { // && value.indexOf(" ") >= 0
                value = "'" + value + "'";
            }
            // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
            // e.g. {sleepy: true} => ["sleepy=true"]
            arr.push(key + "=" + value);
        }
    }
    // translate array of strings to a single comma-separated string
    return arr.toString();
}

// Object for all our SQL statement functions.
const orm = {
    // select all 
    getAll: function(tableInput, cb) {
        const queryString = "SELECT * FROM " + tableInput + ";";
        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }
            cb(result);
        });
    },
    // select one 
    getOne: function(tableInput, condition, cb) {
        const queryString = "SELECT * FROM " + tableInput + " " + condition + ";";
        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }
            cb(result);
        });
    },
    // insert one
    addOne: function(table, cols, vals, cb) {
        let queryString = "INSERT INTO " + table;

        queryString += " (";
        queryString += cols.toString();
        queryString += ") ";
        queryString += "VALUES (";
        queryString += printQuestionMarks(vals.length);
        queryString += ") ";

        connection.query(queryString, vals, (err, result) => {
            if (err) {
                throw err;
            }

            cb(result);
        });
    },
    // An example of objColVals would be {name: panther, sleepy: true}
    // update one
    updateOne: function(table, objColVals, condition, cb) {
        let queryString = "UPDATE " + table;

        queryString += " SET ";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += condition;

        console.log(queryString);
        connection.query(queryString, (err, result) => {
            if (err) {
                throw err;
            }

            cb(result);
        });
    },
    //delete one recipe
    deleteOne: (table, column, id, cb) => {
        connection.query("DELETE FROM ?? WHERE ?? = ?", [table, column, id], (err, result) => {
            if (err) {
                throw err;
            }
            cb(result);
        });
    }
};

module.exports = orm;