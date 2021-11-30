const express = require('express');
const router = express.Router();
const genresService = require('../services/genresService');
const {redisSet} = require("../middleware/redisMiddleware")

/**
 * Get list of all genres in the database
 *
 * @example - genres/all
 */
router.get("/all", async (req, res) => {
    const data = await genresService.getAllGenres(
    );

    if(data.length != 0){
        redisSet(req.originalUrl, JSON.stringify(data));
    }

    res.send(data)
});

module.exports = router;
