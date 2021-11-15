const moviesModel = require('../models/moviesModel');
// import fetch from 'node-fetch';

module.exports.getMovies = async (sorting, number, offset, category) => {
    let movies = await moviesModel.getAllMoviesWithSorting(sorting, number, offset)

    if(movies.length == 0){
        //Try external site
        // fetch
        // const movies
    }
    
    return movies;
}