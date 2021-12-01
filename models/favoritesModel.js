const mysql = require('./connections/MySQLConnection');

module.exports.getFavoritesList = async (userId) => {
    return await mysql.query(
        "SELECT * FROM favoritesList " + 
        "WHERE userId = ? ",
        [userId]
    );
}

module.exports.getFavoritesListMovies = async (favoritesId) => {
    return await mysql.query(
        "SELECT * FROM favoritesListToMovie " + 
        "INNER JOIN movies ON favoritesListToMovie.movieId = movies.id " +
        "WHERE favoritesListToMovie.favoritesId = ?",
        [favoritesId]
    );
}

module.exports.addMovieToFavoritesList = async (favoritesId, movieId) => {
    return await mysql.query(
        "INSERT INTO favoritesListToMovie (favoritesId, movieId) VALUES (?, ?) ",
        [favoritesId, movieId]
    );
}

module.exports.removeMovieFromFavoritesList = async (favoritesId, movieId) => {
    return await mysql.query(
        "DELETE FROM favoritesListToMovie " +
        "WHERE favoritesListToMovie.favoritesId = ? AND  favoritesListToMovie.movieId = ?",
        [favoritesId, movieId]
    );
}

module.exports.getFavoritesListToMovie = async (favoritesId, movieId) => {
    return await mysql.query(
        "SELECT * FROM favoritesListToMovie " + 
        "WHERE favoritesListToMovie.favoritesId = ? AND  favoritesListToMovie.movieId = ?",
        [favoritesId, movieId]
    );
}