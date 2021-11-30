const mysql = require('./connections/MySQLConnection');

module.exports.getAllGenres = async () => {
    return await mysql.query(
        "SELECT * FROM genre",
        []
    );
}