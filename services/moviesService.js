const moviesModel = require('../models/moviesModel');

module.exports.getMovies = async (sorting, number, offset, category) => {
    let movies = await moviesModel.getAllMoviesWithSorting(sorting, number, offset, category)

    if(movies.length != 0){
        for(let i = 0; i<movies.length; i++){
            let otherData = await moviesModel.getMoreDataForMovie(movies[i]["id"]);

            movies[i] = {
                ...movies[i],
                ...otherData
            }
        }
    }
    
    return movies;
}