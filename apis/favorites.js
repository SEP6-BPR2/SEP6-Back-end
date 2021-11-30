const express = require('express');
const router = express.Router();
const favoritesService = require('../services/favoritesService');
const {redisSet} = require("../middleware/redisMiddleware")

router.get("/:userId", async (req, res) => {
    const data = await favoritesService.getFavoritesList(
        req.params.userId
    );

    if(data.length != 0){
        redisSet(req.originalUrl, JSON.stringify(data));
    }

    res.send(data)
});

router.post("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.addMovieToFavoritesList(
        req.params.userId,
        req.params.movieId
    );

    res.sendStatus(status)
});

router.delete("/:userId/:movieId", async (req, res) => {
    //Need token validation
    const status = await favoritesService.removeMovieFromFavoritesList(
        req.params.userId,
        req.params.movieId
    );
    res.sendStatus(status)
});

module.exports = router;
