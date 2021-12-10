const express = require('express') 
const router = express.Router() 
const usersService = require('../services/usersService') 
const { param, body } = require('express-validator') 
const { validate } = require("../middleware/validateMiddleware")
const validateJWT = require('../middleware/jwtValidationMiddleware')

/**
 * Register user in the database
 * @param userId - string, id of the user, based on what firebase gives
 * @param nickname - string, name of the user NOT ACTUAL NAME OF USER
 *
 * @example - POST {BaseURL}/users/register/123456/rokasbarasa1
 */
router.post("/register/:userId/:nickname", 
    param("userId").isLength({min: 28, max: 35}), 
    param("nickname").isLength({min: 5, max: 50}),
    body("photoURL").isLength({min: 38, max: 150}),
    validate, 
    validateJWT,
async (req, res) => {
    const data = await usersService.registerUser(
        req.params.userId, 
        req.params.nickname,
        req.body.photoURL
    )
    res.send(data)
}) 

/**
 * Get user from the database
 * @param userId - string, id of the user, based on what firebase gives
 *
 * @example - GET {BaseURL}/users/123456
 */
router.get("/:userId", 
    param("userId").isLength({min: 28, max: 35}), 
    validate, 
async (req, res) => {
    const data = await usersService.getUser(
        req.params.userId
    ) 
    res.send(data)
}) 

module.exports = router 
