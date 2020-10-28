/* ORM FOLDER ========================================
We abstract our database and information-modelling code
into this section
====================================================== */

const db = require( '../config/connection.js' )
// an external npm package we are using
const moment = require('moment')


function getList( criteria={} ){
    return db.query( 'SELECT * FROM tasks '+( criteria ? 'WHERE ? ' : '' ), criteria )
}

function insertTask( priority, info, due ){
    if( priority === '' ) {
        priority = 'primary'
    }
    // no due? set to 7 days from now
    if( due === '' ) {
        due = moment().add(7, 'days').format('YYYY-MM-DD' )
    }
    console.log( ' inserting task data: ', { priority, info, due } )
    return db.query( 'INSERT INTO tasks SET ? ',
        { priority, info, due } )
}

function updateTask( id, priority, info, due ){
    return db.query( 'UPDATE tasks SET ? WHERE id=?',
        [ { priority, info, due }, id ] )
}

function deleteTask( id ){
    return db.query( 'DELETE FROM tasks WHERE id=?', [ id ] )
}

module.exports = {
    getList, insertTask, updateTask, deleteTask
}