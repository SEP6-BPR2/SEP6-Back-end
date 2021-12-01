const express = require('express');
const router = express.Router();
const favoritesService = require('../services/favoritesService');
const {redisSet} = require("../middleware/redisMiddleware")

/**
 * Get list of favorite movies for user
 * @param userId - string, id of the user, based on what firebase gives
 * 
 * @example - GET {BaseURL}/favorites/123456
 */
router.get("/:userId", async (req, res) => {
    const data = await favoritesService.getFavoritesList(
        req.params.userId
    );

    if(data != null){
        redisSet(req.originalUrl, JSON.stringify(data));
    }

    res.send(data)
});

/**
 * Add movie to users favorite list
 * @param userId - string, id of the user, based on what firebase gives
 * @param movieId - string, id of the movie
 *
 * @example - POST {BaseURL}/favorites/123456/146870
 */
router.post("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.addMovieToFavoritesList(
        req.params.userId,
        parseInt(req.params.movieId)
    );

    res.sendStatus(status)
});

/**
 * Remove movie from users favorite list
 * @param userId - string, id of the user, based on what firebase gives
 * @param movieId - string, id of the movie
 *
 * @example - DELETE {BaseURL}/favorites/123456/146870
 */
router.delete("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.removeMovieFromFavoritesList(
        req.params.userId,
        parseInt(req.params.movieId)
    );
    res.sendStatus(status)
});

/**
 * Check if the movie is in the users favorite list. Returns boolean "exists".
 * @param userId - string, id of the user, based on what firebase gives
 * @param movieId - string, id of the movie
 *
 * @example - GET {BaseURL}/favorites/inFavorites/123456/146870
 */
router.get("/inFavorites/:userId/:movieId", async (req, res) => {
    const data = await favoritesService.isMovieInUserFavorites(
        req.params.userId,
        parseInt(req.params.movieId)
    );
    res.send(data)
});

module.exports = router;
