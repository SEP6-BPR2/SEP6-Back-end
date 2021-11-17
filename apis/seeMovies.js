const express = require('express');
const router = express.Router();
const moviesService = require('../services/moviesService');

/**
 * @swagger
 * /movies/{sorting}/{number}/{offset}/{category}:
 *  get:
 *      summary: Retrieve list of movies. 
 *      parameters:
 *        - in: sorting
 *          name: sorting
 *          required: true
 *          description: Existing parameter in the movie object. Ex. tile
 *          schema:
 *              type: string
 *        - in: number
 *          name: number
 *          required: true
 *          description: Number of movies to retrieve.
 *          schema:
 *              type: integer
 *        - in: offset
 *          name: offset
 *          required: true
 *          description: Number of movies to retrieve.
 *          schema:
 *              type: integer
 *        - in: category
 *          name: category
 *          required: true
 *          description: Category which the movies have to match.
 *          schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: List of movies according to specification.
 */
router.get("/:sorting/:number/:offset/:category", async (req, res) => {
    res.send(await moviesService.getMovies(req.params.sorting, req.params.number, req.params.offset, req.params.category));
});

module.exports = router;