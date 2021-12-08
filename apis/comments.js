const express = require('express') 
const router = express.Router() 
const commentService = require("../services/commentService")
const { param, body } = require('express-validator')
const { validate } = require("../middleware/validateMiddleware")
const validateJWT = require('../middleware/jwtValidationMiddleware')

/**
 * Get first order comments that are in movie description
 * @param movieId - integer, id for which to get comments for.
 * @param number - int, how many comments to return
 * @param offset - int, how many comments to skip by
 *
 * @example - GET {BaseURL}/getFirstOrderComments/123456/1/0
 */
router.get("/getFirstOrderComments/:movieId/:number/:offset", 
    param("movieId").isInt({min:1 ,max:9999999}), 
    param("number").isInt({min:1 ,max:1000}),
    param("offset").isInt({min:0 ,max:9999999}),
    validate, 
async (req, res) => {
    const data = await commentService.getCommentsFirstOrder(
        parseInt(req.params.movieId),
        parseInt(req.params.number),
        parseInt(req.params.offset)
    ) 

    res.send(data)
}) 

/**
 * Get comments that are replying to a comment that are in movie description
 * @param movieId - integer, id for which to get comments for.
 * @param number - int, how many comments to return
 * @param offset - int, how many comments to skip by
 * 
 * @example - GET {BaseURL}/getSecondOrderComments/123456/1/0
 */
router.get("/getSecondOrderComments/:movieId/:commentId/:number/:offset", 
    param("movieId").isInt({min:1 ,max:9999999}), 
    param("commentId").isInt({min:1 ,max:9999999999}), 
    param("number").isInt({min:1 ,max:1000}),
    param("offset").isInt({min:0 ,max:9999999}),
    validate, 
async (req, res) => {
    const data = await commentService.getCommentsSecondOrder(
        parseInt(req.params.movieId),
        parseInt(req.params.commentId),
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
