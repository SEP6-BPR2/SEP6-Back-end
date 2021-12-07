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
router.get("/:movieId/:number/:offset", 
    param("movieId").isInt({min:1 ,max:9999999}), 
    param("number").isInt({min:1 ,max:1000}),
    param("offset").isInt({min:0 ,max:9999999}),
    validate, 
async (req, res) => {
    const data = await commentService.getComments(
        parseInt(req.params.movieId),
        parseInt(req.params.number),
        parseInt(req.params.offset)
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
    param("userId").isLength({min: 28, max: 35}),
    param("movieId").isInt({min:1 ,max:9999999}), 
    body("replyCommentId").custom((value) => validateNullOrInt(value)),
    body("text").isLength({min:1 ,max:1000}),
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


function validateNullOrInt(value){
    if (value == null || !isNaN(parseInt(value))) {
        if(value == null || value >= 1 && value <= 9999999){
            return true;
        }else{
            throw new Error('Value is not valid');
        }
    }else{
        throw new Error('Value is not null or int');
    }
}

module.exports = router 
