const mysql = require('./connections/MySQLConnection');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getAllMoviesWithSorting = async (sorting, number, offset, category, descending, search) => {
    let parameters = []
    let order = descending == 1? "DESC": "ASC";
    let searchSQL;
    let categorySQL;
    if(category == "any"){
        categorySQL = ""
    }else{
        categorySQL = "INNER JOIN movieToGenre " +
        "ON movies.id = movieToGenre.movieId " +
        "AND movieToGenre.genreId in ( SELECT genre.genreId FROM genre WHERE genre.genreName = ? ) ";
        parameters.push(category)
    }

    if(search == null){
        searchSQL = ""
    }else{
        searchSQL = "WHERE title like ? "
        parameters.push("%" + search + "%")
    }
    
    // parameters.push(sorting)
    parameters.push(offset)
    parameters.push(number)

    return mysql.query(
        "SELECT movies.id, movies.title, movies.posterURL as poster, substring(description,1,100) as description FROM movies " +
        categorySQL +
        searchSQL +
        "ORDER BY movies." + escapeSansQuotes(sorting) + " "+ order +" " +
        "LIMIT ?,? ",
        parameters
    );
}

function escapeSansQuotes(criterion) {
    return mysql.connection.escape(criterion).match(/^'(\w+)'$/)[1];
}

module.exports.getMovieByIDThirdParty = async (id) => {
    return fetch(process.env.EXTERNAL_MOVIE_DB_BASE_URL+ "?i=" + id + "&apikey=" + process.env.EXTERNAL_MOVIE_DB_KEY );
}

module.exports.getMovieByIDFallbackThirdParty = async (id) => {
    return fetch("https://api.themoviedb.org/3/movie/"+ id +"?api_key=" + process.env.EXTERNAL_FALLBACK_MOVIE_DB_KEY);
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

module.exports.updateMoviePoster = async (movie) => {
    await mysql.query(
        "UPDATE movies " +
        "SET movies.posterURL = ?, " +
        "movies.lastUpdated = NOW() " +
        "WHERE movies.id = ? ",
        [
            movie.posterURL, 
            movie.id
        ]
    );
}

module.exports.insertGenre = async (name) => {
    return mysql.query(
        "INSERT INTO genre (genreName) VALUES (?) ",
        [name]
    );
}

module.exports.getGenreByName = async (name) => {
    return mysql.query(
        "SELECT * FROM genre WHERE genre.genreName = ?",
        [name]
    );
}

module.exports.insertMovieToGenre = async (movieId, genreId) => {
    return mysql.query(
        "INSERT INTO movieToGenre (movieId, genreId) VALUES (?, ?) ",
        [movieId, genreId]
    );
}

module.exports.getPersonByName = async (firstName, lastName) => {
    return mysql.query(
        "SELECT * FROM person WHERE person.firstName = ? AND person.lastName = ?",
        [firstName, lastName]
    );
}

module.exports.insertPerson = async (firstName, lastName) => {
    return mysql.query(
        "INSERT INTO person (firstName, lastName) VALUES (?, ?) ",
        [firstName, lastName]
    );
}

module.exports.insertMovieToPerson = async (movieId, personId, roleId) => {
    return mysql.query(
        "INSERT INTO movieToPerson (movieId, personId, roleId) VALUES (?, ?, ?) ",
        [movieId, personId, roleId]
    );
}

module.exports.getMovieByMovieId = async (movieId) => {
    return mysql.query(
        "SELECT * FROM movies " +
        "WHERE id = ? ",
        [movieId]
    );
}

module.exports.getPeopleByMovieId = async (movieId) => {
    return mysql.query(
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
    return mysql.query(
        "SELECT genre.genreName " +
        "FROM movieToGenre " +
        "INNER JOIN genre " +
        "ON movieToGenre.genreId = genre.genreId " +
        "WHERE movieToGenre.movieId = ? ",
        [movieId]
    );
}

module.exports.getMoviesWithNoPoster = async () => {
    return mysql.query(
        "SELECT * " +
        "FROM movies " +
        "WHERE posterURL = \"N/A\" ",
        []
    );
}



module.exports.getSortingMethods = async () => {
    return mysql.query(
        "SELECT COLUMN_NAME as columns " +
        "FROM INFORMATION_SCHEMA.COLUMNS " +
        "WHERE TABLE_SCHEMA = Database() " +
        "AND TABLE_NAME = 'movies' ",
        []
    );
}