const moviesModel = require('../models/moviesModel') 
const favoritesService = require('../services/favoritesService') 

module.exports.getListOfMovies = async (sorting, number, offset, category, descending, search) => {
    return module.exports.getMovies(
        sorting, 
        number, 
        offset, 
        category, 
        descending, 
        search
    )
}

module.exports.getMovies = async (sorting, number, offset, category, descending, search) => {
    let movies = await moviesModel.getAllMoviesWithSorting(
        sorting, 
        number, 
        offset, 
        category, 
        descending, 
        search
    )

    //Some movies are not updated. Check that all parameters are updated before sending.
    for(let i = 0;  i< movies.length;  i++){
        if(movies[i].poster == null || movies[i].description == null){

            let otherData = await module.exports.getMoreDataForMovieFromThirdParty(movies[i].id)
            
            movies[i].description = otherData.description.substring(0, 99) 

            let updatedMovie = {
                ...movies[i],
                ...otherData
            }

            //If poster is 
            if(otherData.poster == "N/A"){

                const poster = await module.exports.getPosterFromFallbackThirdParty(movies[i].id)
                if(poster != null){
                    movies[i].poster = "https://image.tmdb.org/t/p/w500" + poster
                    updatedMovie.poster = movies[i].poster
                }else{
                    movies[i].poster = "N/A"
                }

            }else{
                
                movies[i].poster = otherData.poster

            }

            module.exports.updateDatabaseMovie(updatedMovie)

        }
    }
    
    return movies 
}

module.exports.getMoreDataForMovieFromThirdParty = async (movieId) => {
    const stringId = module.exports.convertIdForAPI(movieId)
    const response = await moviesModel.getMovieByIDThirdParty(stringId)
    const body = await response.text()
    const object = JSON.parse(body)

    return {
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
}

module.exports.getPosterFromFallbackThirdParty = async (movieId) => {
    const stringId = module.exports.convertIdForAPI(movieId)
    const response = await moviesModel.getMovieByIDFallbackThirdParty(stringId)
    const body = await response.text()
    const object = JSON.parse(body)

    return object.poster_path
}

//The id has to be a certain length. If it is too short after adding tt 0's need to be added to fill space.
module.exports.convertIdForAPI = (id) => {
    const idLength = 9 
    let idString = id.toString() 
    if(idString != "" && idString.length <= 7 && idString.length > 0){
        idString = "tt" + ("0".repeat(idLength - 2 - idString.length)) + idString 
        return idString
    }else{
        throw Error("Id passed to function has to have 7-1 characters.")
    }
}

module.exports.updateDatabaseMovie = async (movie) => {

    //Genre
    for(let i = 0;  i< movie.genres.length;  i++){
        const genreInDb = await moviesModel.getGenreByName(movie.genres[i])

        if(genreInDb.length == 0){
            const genreInserted = await moviesModel.insertGenre(movie.genres[i])
            
            await moviesModel.insertMovieToGenre(movie.id, genreInserted.insertId)
        }else{
            await moviesModel.insertMovieToGenre(movie.id, genreInDb[0].genreId)
        }
    }

    //Actors
    for(let i = 0;  i< movie.actors.length;  i++){
        const actor = movie.actors[i].split(' ') 
        if (actor.length == 1){
            actor.push("") 
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
    for(let i = 0;  i< movie.directors.length;  i++){
        const director = movie.directors[i].split(' ') 

        if (director.length == 1){
            director.push("") 
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

module.exports.getMovieDetailsAndFavorites = async (movieId, checkFavorites, userId) => {
    const data = await module.exports.getMovieDetails(movieId) 

    if(!data.hasOwnProperty("error") && checkFavorites == 1){
        const favorite = await favoritesService.isMovieInUserFavorites(
            userId,
            movieId
        ) 
        return {
            ...data,
            favorites: favorite.exists
        }
    }else{
        return data
    }
}

module.exports.getMovieDetails = async (movieId) => {
    let movie = await moviesModel.getMovieByMovieId(movieId)
    if(movie.length > 0){
        movie = movie[0] 

        if(!movie.hasOwnProperty("posterURL")){
            const otherData = await module.exports.getMoreDataForMovieFromThirdParty(movie["id"])
            let newMovie = {
                ...movie,
                ...otherData
            }
            
            delete newMovie.posterURL
            
            module.exports.updateDatabaseMovie(newMovie)
            return newMovie
        }else{
    
            const people = await moviesModel.getPeopleByMovieId(movieId) 
        
            const genres = await moviesModel.getGenresByMovieId(movieId) 
        
            let directors = [] 
            let actors = []
            let genresArray = []
            genres.map((genre) => genresArray.push(genre.genreName)) 
        
            for(let i = 0;  i < people.length;   i++){
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
            } 
        }
    }else{
        return {
            error: "Movie not found"
        }
    }
}

module.exports.getBySearch = async (sorting, number, offset, category, descending, search) => {
    return module.exports.getMovies(sorting, number, offset, category, descending, search)
}

module.exports.update = async () => {
    let movies = await moviesModel.getMoviesWithNoPoster()
    let numberPosters = 0

    for(let i = 0;  i < movies.length;  i++){
        let poster = await module.exports.getPosterFromFallbackThirdParty(movies[i].id)
        if(poster != null){
            numberPosters++
            console.log("https://image.tmdb.org/t/p/w500" + poster)
            movies[i].posterURL = "https://image.tmdb.org/t/p/w500" + poster
            moviesModel.updateMovie(movies[i])
        }
    }

    console.log("Movies with posters: " + numberPosters + "/" + movies.length)
    return 200 
}

module.exports.getSortingMethods = async () => {
    return moviesModel.getSortingMethods()
}