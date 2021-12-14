const mysql = require('./connections/mySQLConnection') 

module.exports.getAllGenres = async () => {
    return mysql.query(
        "SELECT genreName FROM genre",
        []
    ) 
}

module.exports.getDuplicates = async () => {
    return mysql.query(
        "SELECT *, count(*) as qty " +
        "FROM movieToGenre " +
        "GROUP BY movieId, genreId HAVING count(*)> 1",
        []
    ) 
}

module.exports.deleteDuplicates = async (movieId, genreId) => {
    return mysql.query(
        "DELETE " +
        "FROM movieToGenre " +
        "WHERE movieId = ? AND genreId = ? ",
        [movieId, genreId]
    ) 
}

module.exports.getDuplicatesPerson = async () => {
    return mysql.query(
        "SELECT *, count(*) as qty " +
        "FROM movieToPerson " +
        "GROUP BY movieId, personId, roleId HAVING count(*)> 1",
        []
    ) 
}
module.exports.deleteDuplicatesPerson = async (movieId, genreId, roleId) => {
    return mysql.query(
        "DELETE " +
        "FROM movieToPerson " +
        "WHERE movieId = ? AND personId = ? AND roleId = ? ",
        [movieId, genreId, roleId]
    ) 
}