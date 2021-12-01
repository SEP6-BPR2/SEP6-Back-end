const mysql = require('./connections/MySQLConnection');

module.exports.getAllGenres = async () => {
    return await mysql.query(
        "SELECT genreName FROM genre",
        []
    );
}