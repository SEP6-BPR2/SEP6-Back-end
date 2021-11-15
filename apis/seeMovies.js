const express = require('express');
const router = express.Router();
const moviesService = require('../services/moviesService');

router.get("/:sorting/:number/:offset/:category", async (req, res) => {
    res.send(await moviesService.getMovies(req.params.sorting, req.params.number, req.params.offset, req.params.category));
});

module.exports = router;