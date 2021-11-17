const mysql = require('./connections/MySQLConnection');
require('dotenv').config(); // Initialize env
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getAllMoviesWithSorting = async (sorting, number, offset, category) => {
    const data = await mysql.query(
        "SELECT * FROM movies " +
        "ORDER BY ? DESC " +
        "LIMIT ?,? ",
        [sorting, parseInt(offset), parseInt(number), ]
    );
    return data;
}


module.exports.getMoreDataForMovie = async (id) => {
    //The id string must be converted to propper length and format
    const stringId = convertIdForAPI(id)
    const response = await fetch(process.env.EXTERNAL_MOVIE_DB_BASE_URL+ "?i=" + stringId + "&apikey=" + process.env.EXTERNAL_MOVIE_DB_KEY );
    const body = await response.text();
    const object = JSON.parse(body);

    let data = {
        description: object.Plot,
        poster: object.Poster,
        genres:[
            ...object.Genre.split(", ")
        ],
        director: object.Director,
        actors: [
            ...object.Actors.split(", ")
        ],
        ratings: [
            {
                imdbRating: object.imdbRating,
                imdbVotes: object.imdbVotes
            },
            ...object.Ratings
        ],
        runtime: object.Runtime,
    }
    return data;
}

//The id has to be a certain length. If it is too short after adding tt 0's need to be added to fill space.
const idLength = 9;
function convertIdForAPI(id){
    let idString = id.toString();
    idString = "tt" + ("0".repeat(idLength - 2 - idString.length)) + idString;
    return idString
}