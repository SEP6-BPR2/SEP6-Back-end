const e = require('express');
const moviesModel = require('../models/moviesModel');

module.exports.getMovies = async (sorting, number, offset, category, decending) => {
    let movies = await moviesModel.getAllMoviesWithSorting(sorting, number, offset, category, decending)

    for(let i = 0; i<movies.length; i++){
        if(movies[i].poster == null){
            let otherData = await getMoreDataForMovieFromThirdParty(movies[i]["id"])
            const newMovie = {
                ...movies[i],
                ...otherData
            }
            movies[i].poster = otherData.poster
            
            updateDatabaseMovie(newMovie)
        }
    }
    
    return movies;
}

async function getMoreDataForMovieFromThirdParty(movieId){
    const stringId = convertIdForAPI(movieId)
    const response = await moviesModel.getMovieByIDThirdParty(stringId)
    const body = await response.text()
    const object = JSON.parse(body)

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
        imdbRating: object.imdbRating,
        imdbVotes: object.imdbVotes,
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


async function updateDatabaseMovie(movie){

    
    //Genre
    for(let i = 0; i< movie.genres.length; i++){
        const genreInDb = await moviesModel.getGenreByName(movie.genres[i])

        if(genreInDb.length == 0){
            const genreInserted = await moviesModel.insertGenre(movie.genres[i])
            
            await moviesModel.insertMovieToGenre(movie.id, genreInserted.insertId)
        }else{
            await moviesModel.insertMovieToGenre(movie.id, genreInDb[0].genreId)
        }
    }

    //Actors
    for(let i = 0; i< movie.actors.length; i++){
        const actor = movie.actors[i].split(' ');
        if (actor.length == 1){
            actor.push("");
        }
        const personInDb = await moviesModel.getPersonByName(actor[0], actor[1])

        if(personInDb.length == 0){

            const personInserted = await moviesModel.insertPerson(actor[0], actor[1])
            await moviesModel.insertMovieToPerson(movie.id, personInserted.insertId, 1)

        }else{

            await moviesModel.insertMovieToPerson(movie.id, personInDb[0].personId, 1)

        }
    }

    //Director
    const director = movie.director.split(' ');
    if (director.length == 1){
        director.push("");
    }
    const directorInDb = await moviesModel.getPersonByName(director[0], director[1])

    if(directorInDb.length == 0){

        const directorInserted = await moviesModel.insertPerson(director[0], director[1])
        await moviesModel.insertMovieToPerson(movie.id, directorInserted.insertId, 2)

    }else{
        
        await moviesModel.insertMovieToPerson(movie.id, directorInDb[0].personId, 2)

    }

    //Update the movie object.
    await moviesModel.updateMovie(movie)
    console.log("Updated object")
}


module.exports.getMovieDetails = async (movieId) => {
    let movie = await moviesModel.getMovieByMovieId(movieId)
    movie = movie[0]

    const people = await moviesModel.getPeopleByMovieId(movieId);

    const genres = await moviesModel.getGenresByMovieId(movieId);

    let director = {};
    let actors = []
    let genresArray = []
    genres.map((genre) => genresArray.push(genre.genreName));

    for(let i = 0; i <= people.length ; i++){
        if (people[i].roleName == "Director"){
            director = people[i].name
            break;
        }else{
            actors.push(people[i].name)
        }
    }

    return {
        ...movie,
        director: director,
        actors: actors,
        genres: genresArray
    };
}


module.exports.getBySearch = async (movieName, number, sorting) => {
    return await moviesModel.getMoviesByPartialString(movieName, number, sorting)
}


