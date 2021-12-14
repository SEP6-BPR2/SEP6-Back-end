const mysql = require('./connections/mySQLConnection') 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)) 

const escapeSansQuotes = (connection, val) => {
    return connection.escape(val).match(/^'(\w+)'$/)[1];
}

module.exports.getAllMoviesWithSorting = async (sorting, number, offset, category, descending, search) => {
    let parameters = []
    let order = descending == 1? "DESC": "ASC" 

    let categorySQL 
    if(category == "any"){
        categorySQL = ""
    }else{
        categorySQL = "INNER JOIN movieToGenre " +
        "ON movies.id = movieToGenre.movieId " +
        "AND movieToGenre.genreId in ( SELECT genre.genreId FROM genre WHERE genre.genreName = ? ) " 
        parameters.push(category)
    }

    let searchSQL 
    if(search == null){
        searchSQL = ""
    }else{
        searchSQL = "WHERE title like ? "
        parameters.push("%" + search + "%")
    }

    sorting = escapeSansQuotes(mysql, sorting)
    parameters.push(offset)
    parameters.push(number)

    return mysql.query(
        "SELECT movies.id, movies.title, movies.posterURL, substring(description,1,100) as description " +
        "FROM movies " +
        categorySQL +
        searchSQL +
        `ORDER BY ${sorting} ${order} ` +

        "LIMIT ?,? ",
        parameters
    )
}

module.exports.getMovieByIDThirdParty = async (id) => {
    return fetch(
        process.env.EXTERNAL_MOVIE_DB_BASE_URL+ "?i=" + id + "&apikey=" + process.env.EXTERNAL_MOVIE_DB_KEY 
    )
}

module.exports.getMovieByIDFallbackThirdParty = async (id) => {
    return fetch(
        "https://api.themoviedb.org/3/movie/"+ id +"?api_key=" + process.env.EXTERNAL_FALLBACK_MOVIE_DB_KEY
    )
}

module.exports.updateMovie = async (movie) => {
    await mysql.query(
        "UPDATE movies " +
        "SET movies.posterURL = ?, " +
        "movies.description = ?, " +
        "movies.runtime = ?, " +
        "movies.rating = ? , " +
        "movies.votes = ? , " +
        "movies.lastUpdated = NOW() " +
        "WHERE movies.id = ? ",
        [
            movie.posterURL, 
            movie.description, 
            movie.runtime, 
            movie.rating, 
            movie.votes, 
            movie.id
        ]
    ) 
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
    ) 
}

module.exports.insertGenre = async (name) => {
    return mysql.query(
        "INSERT INTO genre (genreName) VALUES (?) ",
        [name]
    ) 
}

module.exports.getGenreByName = async (name) => {
    return mysql.query(
        "SELECT * FROM genre WHERE genre.genreName = ?",
        [name]
    ) 
}

module.exports.insertMovieToGenre = async (movieId, genreId) => {
    return mysql.query(
        "INSERT INTO movieToGenre (movieId, genreId) VALUES (?, ?) ",
        [movieId, genreId]
    ) 
}

module.exports.getPersonByName = async (firstName, lastName) => {
    return mysql.query(
        "SELECT * FROM person WHERE person.firstName = ? AND person.lastName = ?",
        [firstName, lastName]
    ) 
}

module.exports.insertPerson = async (firstName, lastName, photoURL) => {
    return mysql.query(
        "INSERT INTO person (firstName, lastName, photoURL) VALUES (?, ?, ?) ",
        [firstName, lastName, photoURL]
    ) 
}

module.exports.insertMovieToPerson = async (movieId, personId, roleId) => {
    return mysql.query(
        "INSERT INTO movieToPerson (movieId, personId, roleId) VALUES (?, ?, ?) ",
        [movieId, personId, roleId]
    ) 
}

module.exports.getMovieByMovieId = async (movieId) => {
    return mysql.query(
        "SELECT * FROM movies " +
        "WHERE id = ? ",
        [movieId]
    ) 
}

module.exports.getPeopleByMovieId = async (movieId) => {
    return mysql.query(
        "SELECT CONCAT(person.firstName, ' ', person.lastName) as name, role.roleName, person.photoURL " +
        "FROM movieToPerson " +
        "INNER JOIN person " +
        "ON movieToPerson.personId = person.personId " +
        "INNER JOIN role " +
        "ON movieToPerson.roleId = role.roleId " +
        "WHERE movieToPerson.movieId = ? ",
        [movieId]
    ) 
}

module.exports.getGenresByMovieId = async (movieId) => {
    return mysql.query(
        "SELECT genre.genreName " +
        "FROM movieToGenre " +
        "INNER JOIN genre " +
        "ON movieToGenre.genreId = genre.genreId " +
        "WHERE movieToGenre.movieId = ? ",
        [movieId]
    ) 
}

module.exports.getMoviesWithNoPoster = async () => {
    return mysql.query(
        "SELECT * " +
        "FROM movies " +
        "WHERE posterURL = \"N/A\" ",
        []
    ) 
}

module.exports.getAttributesNames = async () => {
    return mysql.query(
        "SELECT COLUMN_NAME as collumns " +
        "FROM INFORMATION_SCHEMA.COLUMNS " +
        "WHERE TABLE_SCHEMA = Database() " +
        "AND TABLE_NAME = 'movies' ",
        []
    ) 
}

module.exports.getPersonsWithoutAPhoto = async () => {
    return mysql.query(
        "SELECT * " +
        "FROM person " +
        "WHERE photoURL IS NULL ",
        []
    ) 
}

module.exports.updatePerson = async (person) => {
    await mysql.query(
        "UPDATE person " +
        "SET person.firstName = ?, " +
        "person.lastName = ?, " +
        "person.description = ?, " +
        "person.photoURL = ? " +
        "WHERE person.personId = ? ",
        [
            person.firstName, 
            person.lastName, 
            person.description, 
            person.photoURL, 
            person.personId
        ]
    ) 
}

module.exports.getMovieToPerson = async (movieId, personId, roleId) => {
    return mysql.query(
        "SELECT * " +
        "FROM movieToPerson " +
        "WHERE movieId = ? AND personId = ? AND roleId = ? ",
        [movieId, personId, roleId]
    ) 
}

module.exports.getMovieToGenre = async (movieId, genreId) => {
    return mysql.query(
        "SELECT * " +
        "FROM movieToGenre " +
        "WHERE movieId = ? AND genreId = ? ",
        [movieId, genreId]
    ) 
}