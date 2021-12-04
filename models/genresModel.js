const mysql = require('./connections/MySQLConnection');

module.exports.getAllGenres = async () => {
    return mysql.query(
        "SELECT genreName FROM genre",
        []
    );
}