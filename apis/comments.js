const express = require('express');
const router = express.Router();
const commentService = require("../services/commentService")
const { param } = require('express-validator');
const { validate } = require("../middleware/validateMiddleware")
const validateJWT = require('../middleware/JwtValidation')
/**
 * Get comments that are in movie description
 * @param movieId - integer, id for which to get comments for.
 *
 * @example - GET {BaseURL}/comments/123456
 */
router.get("/:movieId", 
    param("movieId").notEmpty(), 
    validate, 
async (req, res) => {
    const data = await commentService.getComments(
        req.params.movieId
    );

    res.send(data)
});

/**
 * Get user from the database
 * @param userId - integer, id for which to post comments for.
 *
 * @example - POST {BaseURL}/comments/44484/123456
 */
router.post("/:userId/:movieId", 
    param("userId").notEmpty(),
    param("movieId").notEmpty(), 
    validate, 
    validateJWT,
async (req, res) => {
    const data = await usersService.postComment(
        req.params.userId,
        req.params.movieId,
        req.body
    );

    res.send(data)
});

module.exports = router;
