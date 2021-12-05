const express = require('express') 
const router = express.Router() 
const commentService = require("../services/commentService")
const { param, body } = require('express-validator')
const { validate } = require("../middleware/validateMiddleware")
const validateJWT = require('../middleware/jwtValidationMiddleware')

/**
 * Get comments that are in movie description
 * @param movieId - integer, id for which to get comments for.
 *
 * @example - GET {BaseURL}/comments/123456
 */
router.get("/:movieId", 
    param("movieId").notEmpty().isInt({min:1 ,max:9999999}), 
    validate, 
async (req, res) => {
    const data = await commentService.getComments(
        parseInt(req.params.movieId)
    ) 

    res.send(data)
}) 

/**
 * Post comment for user
 * @param userId - integer, id for which to post comments for.
 *
 * @example - POST {BaseURL}/comments/44484/123456
 * @body -
 * {
 *     "replyCommentId": null,
 *     "text": "TEXT FOR COMMENT HERE"y
 * }
 */
router.post("/:userId/:movieId", 
    param("userId").notEmpty(),
    param("movieId").notEmpty().isInt({min:1 ,max:9999999}), 
    body("replyCommentId").optional().isInt(),
    body("text").notEmpty(),
    validate, 
    validateJWT,
async (req, res) => {
    await commentService.postComment(
        req.params.userId,
        parseInt(req.params.movieId),
        req.body
    ) 

    res.sendStatus(200)
}) 

module.exports = router 
