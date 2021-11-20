const express = require('express');
const router = express.Router();
const moviesService = require('../services/moviesService');

/**
 * Get list of movies
 * @param sorting - string, what parameter in movie object to sort by
 * @param number - int, how many movies to return
 * @param offset - int, how many movies to skip by
 * @param category - string, how many movies to return
 * @param decending - 1 or 0, 1 - sort and show decending, 0 - sort and show ascending 
 */
router.get("/:sorting/:number/:offset/:category/:decending", async (req, res) => {
    res.send(await moviesService.getMovies(req.params.sorting, req.params.number, req.params.offset, req.params.category, req.params.decending));
});

/**
 * Get more info about specific movie
 * @param movieId - string, id of the movie 
 */
router.get("/details/:movieId", async (req, res) => {
    res.send(await moviesService.getMovieDetails(req.params.movieId));
});

/**
 * Search for movie by partial string or full string
 * @param sorting - string, what parameter in movie object to sort by
 * @param number - int, how many movies to return
 * @param movieName - string, partial or full string of movie
 */
router.get("/search/:movieName/:number/:sorting", async (req, res) => {
    res.send(await moviesService.getBySearch(req.params.movieName, req.params.number, req.params.sorting));
});

module.exports = router;