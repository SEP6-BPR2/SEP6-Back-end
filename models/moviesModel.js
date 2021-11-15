const mysql = require('./connections/MySQLConnection');

module.exports.getAllMoviesWithSorting = async (sorting, number, offset) => {
    const data = await mysql.query(
        "SELECT * FROM movies " +
        "ORDER BY ? ASC " +
        "LIMIT ?,? ",
        [sorting, parseInt(offset), parseInt(number), ]
    );
    return data;
}