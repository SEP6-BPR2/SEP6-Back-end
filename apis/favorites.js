const express = require('express');
const router = express.Router();
const favoritesService = require('../services/favoritesService');
const {redisSet} = require("../middleware/redisMiddleware")

/**
 * Get list of favorite movies for user
 * @param userId - string, id of the user, based on what firebase gives
 * 
 * @example - users/123456
 */
router.get("/:userId", async (req, res) => {
    const data = await favoritesService.getFavoritesList(
        req.params.userId
    );

    if(data.length != 0){
        redisSet(req.originalUrl, JSON.stringify(data));
    }

    res.send(data)
});

/**
 * Add movie to users favorite list
 * @param userId - string, id of the user, based on what firebase gives
 * @param movieId - string, id of the movie
 *
 * @example - users/123456/146870
 */
router.post("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.addMovieToFavoritesList(
        req.params.userId,
        req.params.movieId
    );

    res.sendStatus(status)
});

/**
 * Remove movie from users favorite list
 * @param userId - string, id of the user, based on what firebase gives
 * @param movieId - string, id of the movie
 *
 * @example - users/123456/146870
 */
router.delete("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.removeMovieFromFavoritesList(
        req.params.userId,
        req.params.movieId
    );
    res.sendStatus(status)
});

module.exports = router;
