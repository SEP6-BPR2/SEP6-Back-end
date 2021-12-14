const express = require('express') 
const router = express.Router() 
const genresService = require('../services/genresService') 
const { redisSet } = require("../middleware/redisMiddleware")

/**
 * Get list of all genres in the database
 *
 * @example - GET {BaseURL}/genres/all
 */
router.get("/all", async (req, res) => {
    const data = await genresService.getAllGenres() 

    redisSet(req.originalUrl, data) 

    res.send(data)
}) 

router.get("/duplicates", async (req, res) => {
    await genresService.deleteDuplicates() 
    res.sendStatus(200)
}) 

module.exports = router 
