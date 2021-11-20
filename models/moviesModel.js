const mysql = require('./connections/MySQLConnection');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getAllMoviesWithSorting = async (sorting, number, offset, category, decending) => {

    const order = decending == "1"? "DESC": "ASC";
    

    // const getGroupIdSubquery = " SELECT genre.genreId FROM genre " +
    // "WHERE genre.genreName = ? ";
    
    //Change to inner join later
    const data = await mysql.query(
        "SELECT movies.id, movies.title, movies.posterURL as poster FROM movies " +
        // "INNER JOIN movieToGenre " +
        // "ON movies.id = movieToGenre.movieId " +
        // "AND movieToGenre.genreId in ("+ getGroupIdSubquery +") " +
        "ORDER BY ? "+ order +" " +
        "LIMIT ?,? ",
        // [category, sorting, parseInt(offset), parseInt(number)]
        [sorting, parseInt(offset), parseInt(number)]

    );

    return data;
}

module.exports.getMovieByIDThirdParty = async (id) => {
    return await fetch(process.env.EXTERNAL_MOVIE_DB_BASE_URL+ "?i=" + id + "&apikey=" + process.env.EXTERNAL_MOVIE_DB_KEY );
}

module.exports.updateMovie = async (movie) => {
    await mysql.query(
        "UPDATE movies " +
        "SET movies.posterURL = ?, " +
        "movies.description = ?, " +
        "movies.runtime = ?, " +
        "movies.imdbRating = ? , " +
        "movies.imdbVotes = ? , " +
        "movies.lastUpdated = NOW() " +
        "WHERE movies.id = ? ",
        [
            movie.poster, 
            movie.description, 
            movie.runtime, 
            movie.imdbRating, 
            movie.imdbVotes, 
            movie.id
        ]
    );
}

module.exports.insertGenre = async (name) => {
    return await mysql.query(
        "INSERT INTO genre (genreName) VALUES (?) ",
        [name]
    );
}

module.exports.getGenreByName = async (name) => {
    return await mysql.query(
        "SELECT * FROM genre WHERE genre.genreName = ?",
        [name]
    );
}

module.exports.insertMovieToGenre = async (movieId, genreId) => {
    return await mysql.query(
        "INSERT INTO movieToGenre (movieId, genreId) VALUES (?, ?) ",
        [movieId, genreId]
    );
}

module.exports.getPersonByName = async (firstName, lastName) => {
    return await mysql.query(
        "SELECT * FROM person WHERE person.firstName = ? AND person.lastName = ?",
        [firstName, lastName]
    );
}

module.exports.insertPerson = async (firstName, lastName) => {
    return await mysql.query(
        "INSERT INTO person (firstName, lastName) VALUES (?, ?) ",
        [firstName, lastName]
    );
}

module.exports.insertMovieToPerson = async (movieId, personId, roleId) => {
    return await mysql.query(
        "INSERT INTO movieToPerson (movieId, personId, roleId) VALUES (?, ?, ?) ",
        [movieId, personId, roleId]
    );
}

module.exports.getMovieByMovieId = async (movieId) => {
    return await mysql.query(
        "SELECT * FROM movies " +
        "WHERE id = ? ",
        [movieId]
    );
}

module.exports.getPeopleByMovieId = async (movieId) => {
    return await mysql.query(
        "SELECT CONCAT(person.firstName, ' ', person.lastName) as name, role.roleName " +
        "FROM movieToPerson " +
        "INNER JOIN person " +
        "ON movieToPerson.personId = person.personId " +
        "INNER JOIN role " +
        "ON movieToPerson.roleId = role.roleId " +
        "WHERE movieToPerson.movieId = ? ",
        [movieId]
    );
}

module.exports.getGenresByMovieId = async (movieId) => {
    return await mysql.query(
        "SELECT genre.genreName " +
        "FROM movieToGenre " +
        "INNER JOIN genre " +
        "ON movieToGenre.genreId = genre.genreId " +
        "WHERE movieToGenre.movieId = ? ",
        [movieId]
    );
}

module.exports.getMoviesByPartialString = async (movieName, number, sorting) => {
    return await mysql.query(
        "SELECT id, title, year, posterURL as poster " +
        "FROM movies where title like ? " +
        "ORDER BY ? DESC " +
        "LIMIT ? ",
        [movieName + "%", sorting, parseInt(number)]
    );
    
}
