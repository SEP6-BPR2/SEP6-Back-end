const moviesModel = require('../models/moviesModel') 
const favoritesService = require('../services/favoritesService') 
const personModel = require('../models/personModel') 

const sortingOptionsDTO = {sortingOptions: ['year', 'title', 'rating', 'votes', 'runtime']}

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

module.exports.getBySearch = async (sorting, number, offset, category, descending, search) => {
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
        if(movies[i].posterURL == null || movies[i].description == null){

            const otherData = await module.exports.getMoreDataForMovieFromThirdParty(movies[i].id)
            movies[i].description = otherData.description.substring(0, 99) 
            let updatedMovie = {
                ...movies[i],
                ...otherData
            }
            
            if(otherData.posterURL == "N/A"){
                const posterURL = await module.exports.getPosterFromFallbackThirdParty(movies[i].id)
                if(posterURL != null){
                    movies[i].posterURL = "https://image.tmdb.org/t/p/w500" + posterURL
                    updatedMovie.posterURL = movies[i].posterURL
                }else{
                    movies[i].posterURL = "N/A"
                }
            }else{
                movies[i].posterURL = otherData.posterURL
            }

            module.exports.updateDatabaseMovie(updatedMovie)

        }
    }
    
    return movies 
}

module.exports.getPhotosForPersons = async (movie) => {
    
    for(let i = 0; i < movie.directors.length; i++){
        let personData = await personModel.searchPersonByName(movie.directors[i].name)
        const body = await personData.text()
        const object = JSON.parse(body)

        // console.log(JSON.stringify(object) + "\n\n")

        if(object.results != null && object.results.length > 0 && object.results[0].hasOwnProperty("profile_path") && object.results[0].profile_path != null){
            movie.directors[i].photoURL = "https://image.tmdb.org/t/p/w500" + object.results[0].profile_path
        }else{
            movie.directors[i].photoURL = "N/A"
        }
    }

    for(let i = 0; i < movie.actors.length; i++){
        let personData = await personModel.searchPersonByName(movie.actors[i].name)
        const body = await personData.text()
        const object = JSON.parse(body)

        // console.log(JSON.stringify(object) + "\n\n")

        if(object.results != null && object.results.length > 0 && object.results[0].hasOwnProperty("profile_path") && object.results[0].profile_path != null){
            movie.actors[i].photoURL = "https://image.tmdb.org/t/p/w500" + object.results[0].profile_path
        }else{
            movie.actors[i].photoURL = "N/A"
        }
    }
    
    return movie
}

module.exports.getMoreDataForMovieFromThirdParty = async (movieId) => {
    const stringId = module.exports.convertIdForAPI(movieId)
    const response = await moviesModel.getMovieByIDThirdParty(stringId)
    const body = await response.text()
    const object = JSON.parse(body)

    let votes = object.imdbVotes.replace(',', '')
    votes = (votes != null && !isNaN(parseInt(votes)))? parseInt(votes) : 0
    const rating = (object.imdbRating != null && !isNaN(parseFloat(object.imdbRating)))? parseFloat(object.imdbRating) : 0.0
    const runtime = object.Runtime != "N/A"? object.Runtime : "0 min"
    
    return {
        description: object.Plot,
        posterURL: object.Poster,
        genres:[
            ...object.Genre.split(", ")
        ],
        directors: object.Director.split(", ").map((value) => {
            return {name: value, photoURL: null}
        }),
        actors: object.Actors.split(", ").map((value) => {
            return {name: value, photoURL: null}
        }),
        rating: rating ,
        votes: votes,
        runtime: runtime
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

    //Get photos for people in movie
    movie = await module.exports.getPhotosForPersons(movie)

    //Genre
    for(let i = 0;  i< movie.genres.length;  i++){
        const genreInDb = await moviesModel.getGenreByName(movie.genres[i])

        if(genreInDb.length == 0){

            const genreInserted = await moviesModel.insertGenre(movie.genres[i])
            
            await moviesModel.insertMovieToGenre(movie.id, genreInserted.insertId)
        }else{
            const movieToGenre = await moviesModel.getMovieToGenre(movie.id, genreInDb[0].genreId)
            
            if(movieToGenre.length == 0){
                await moviesModel.insertMovieToGenre(movie.id, genreInDb[0].genreId)
            }
        }
    }

    //Actors
    for(let i = 0;  i< movie.actors.length;  i++){
        const actor = movie.actors[i].name.split(' ') 
        if (actor.length == 1){
            actor.push("") 
        }
        const personInDb = await moviesModel.getPersonByName(actor[0], actor[1])

        if(personInDb.length == 0){

            const personInserted = await moviesModel.insertPerson(actor[0], actor[1], movie.actors[i].photoURL)
            await moviesModel.insertMovieToPerson(movie.id, personInserted.insertId, 1)

        }else{
            const movieToPerson = await moviesModel.getMovieToPerson(movie.id, personInDb[0].personId, 1)
            
            if(movieToPerson.length == 0){
                await moviesModel.insertMovieToPerson(movie.id, personInDb[0].personId, 1)
            }
        }
    }

    //Directors
    for(let i = 0;  i< movie.directors.length;  i++){
        const director = movie.directors[i].name.split(' ') 

        if (director.length == 1){
            director.push("") 
        }

        const directorInDb = await moviesModel.getPersonByName(director[0], director[1])

        if(directorInDb.length == 0){

            const directorInserted = await moviesModel.insertPerson(director[0], director[1], movie.directors[i].photoURL)
            await moviesModel.insertMovieToPerson(movie.id, directorInserted.insertId, 2)

        }else{
            const movieToPerson = await moviesModel.getMovieToPerson(movie.id, directorInDb[0].personId, 2)
            
            if(movieToPerson.length == 0){
                await moviesModel.insertMovieToPerson(movie.id, directorInDb[0].personId, 2)
            }
            
        }
    }

    moviesModel.updateMovie(movie)
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

        if(movie.posterURL == null){
            const otherData = await module.exports.getMoreDataForMovieFromThirdParty(movie["id"])
            
            let newMovie = {
                ...movie,
                ...otherData
            }

            newMovie = await module.exports.getPhotosForPersons(newMovie)
                        
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
                    directors.push({name: people[i].name, photoURL: people[i].photoURL})
                }else{
                    actors.push({name: people[i].name, photoURL: people[i].photoURL})
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

module.exports.getSortingMethods = () => {
    return sortingOptionsDTO;
}

module.exports.update = async () => {
    // let movies = await moviesModel.getMoviesWithNoPoster()
    // let numberPosters = 0

    // for(let i = 0;  i < movies.length;  i++){
    //     let posterURL = await module.exports.getPosterFromFallbackThirdParty(movies[i].id)
    //     if(posterURL != null){
    //         numberPosters++
    //         console.log("https://image.tmdb.org/t/p/w500" + posterURL)
    //         movies[i].posterURL = "https://image.tmdb.org/t/p/w500" + posterURL
    //         moviesModel.updateMovie(movies[i])
    //     }
    // }

    // console.log("Movies with posters: " + numberPosters + "/" + movies.length)

    let persons = await moviesModel.getPersonsWithoutAPhoto()
    let numberPhotos = 0

    for(let i = 0;  i < persons.length;  i++){
        let personData = await personModel.searchPersonByName(persons[i].firstName + " " + persons[i].lastName)
        const body = await personData.text()
        const object = JSON.parse(body)
        if(object.results.length > 0 && object.results[0].hasOwnProperty("profile_path") && object.results[0].profile_path != null){
            let photoURL = "https://image.tmdb.org/t/p/w500" + object.results[0].profile_path
            numberPhotos++
            console.log(photoURL)
            persons[i].photoURL = photoURL
            moviesModel.updatePerson(persons[i])
        }
    }

    console.log("Movies with posters: " + numberPhotos + "/" + persons.length)

    return 200 
}