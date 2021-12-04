const mysql = require('./connections/mySQLConnection') 

module.exports.getAllGenres = async () => {
    return mysql.query(
        "SELECT genreName FROM genre",
        []
    ) 
}