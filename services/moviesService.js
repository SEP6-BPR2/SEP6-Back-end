const moviesModel = require('../models/moviesModel');


module.exports.getListOfMovies = async (sorting, number, offset, category, decending, search) => {
    let data = await getMovies(
        sorting, 
        number, 
        offset, 
        category, 
        decending, 
        search
    )

    // if(data.length ==  0){
    //     throw Error("Not implemented")
    //     //Find by genre from third party instead
    // }
    
    return data;
}

async function getMovies(sorting, number, offset, category, decending, search) {
    
    let movies = await moviesModel.getAllMoviesWithSorting(
        sorting, 
        number, 
        offset, 
        category, 
        decending, 
        search
    )

    //Some movies are not updated. Check that all parameters are updated before sending.
    for(let i = 0; i< movies.length; i++){
        if(movies[i].poster == null || movies[i].description == null){

            let otherData = await getMoreDataForMovieFromThirdParty(movies[i].id)
            
            movies[i].description = otherData.description.substring(0, 99);

            let updatedMovie = {
                ...movies[i],
                ...otherData
            }

            //If poster is 
            if(otherData.poster == "N/A"){

                const poster = await getPosterFromFallbackThirdparty(movies[i].id)
                if(poster != null){
                    movies[i].poster = "https://image.tmdb.org/t/p/w500" + poster
                    updatedMovie.poster = movies[i].poster
                }else{
                    movies[i].poster = "N/A"
                }

            }else{
                
                movies[i].poster = otherData.poster

            }

            updateDatabaseMovie(updatedMovie)

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
        directors: [
            ...object.Director.split(", "),
        ],
        actors: [
            ...object.Actors.split(", ")
        ],
        imdbRating: object.imdbRating,
        imdbVotes: object.imdbVotes,
        runtime: object.Runtime
    }
    return data;
}

async function getPosterFromFallbackThirdparty(movieId){
    const stringId = convertIdForAPI(movieId)
    const response = await moviesModel.getMovieByIDFallbackThirdParty(stringId)
    const body = await response.text()
    const object = JSON.parse(body)

    return object.poster_path
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

    //Directors
    for(let i = 0; i< movie.directors.length; i++){
        const director = movie.directors[i].split(' ');

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
    }

    //Update the movie object.
    await moviesModel.updateMovie(movie)
    console.log("Updated object")
}

module.exports.getMovieDetails = async (movieId) => {
    let movie = await moviesModel.getMovieByMovieId(movieId)
    movie = movie[0];

    if(!movie.hasOwnProperty("posterURL")){
        let otherData = await getMoreDataForMovieFromThirdParty(movie["id"])
        const newMovie = {
            ...movie,
            ...otherData
        }
        
        delete newMovie.posterURL
        
        updateDatabaseMovie(newMovie)
        return newMovie
    }else{

        const people = await moviesModel.getPeopleByMovieId(movieId);
    
        const genres = await moviesModel.getGenresByMovieId(movieId);
    
        let directors = [];
        let actors = []
        let genresArray = []
        genres.map((genre) => genresArray.push(genre.genreName));
    
        for(let i = 0; i < people.length ; i++){
            if (people[i].roleName == "Director"){
                directors.push(people[i].name)
            }else{
                actors.push(people[i].name)
            }
        }

        return {
            ...movie,
            directors: directors,
            actors: actors,
            genres: genresArray
        };
    }
}

module.exports.getBySearch = async (sorting, number, offset, category, decending, search) => {
    let data = await getMovies(sorting, number, offset, category, decending, search)
    // if(data.length ==  0){
    //     throw Error("Not implemented")
    //     //Search in third party instead
    // }
    
    return data;
}

module.exports.update = async () => {
    let movies = await moviesModel.getMoviesWithNoPoster();
    let numberPosters = 0 
    for(let i = 0; i<movies.length; i++){
        let poster = await getPosterFromFallbackThirdparty(movies[i].id)
        if(poster != null){
            numberPosters++
            console.log("https://image.tmdb.org/t/p/w500" + poster)
            movies[i].posterURL = "https://image.tmdb.org/t/p/w500" + poster
            moviesModel.updateMovie(movies[i])
        }
    }
    console.log("Movies with posters: " + numberPosters + "/" + movies.length)
    return 200;
}

module.exports.getSortingMethods = async () => {
    let data = await moviesModel.getSortingMethods()
    return data;
}