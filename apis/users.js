const express = require('express');
const router = express.Router();
const usersService = require('../services/usersService');
const { param } = require('express-validator');
const { validate } = require("../middleware/validateMiddleware")
const validateJWT = require('../middleware/JwtValidation')

/**
 * Register user in the database
 * @param userId - string, id of the user, based on what firebase gives
 * @param nickname - string, name of the user NOT ACTUAL NAME OF USER
 *
 * @example - POST {BaseURL}/users/register/123456/rokasbarasa1
 */
router.post("/register/:userId/:nickname", 
    param("userId").notEmpty(), 
    param("nickname").notEmpty(),
    validate, 
    validateJWT,
async (req, res) => {
    const data = await usersService.registerUser(
        req.params.userId, 
        req.params.nickname
    );
    res.send(data)
});

/**
 * Get user from the database
 * @param userId - string, id of the user, based on what firebase gives
 *
 * @example - GET {BaseURL}/users/123456
 */
router.get("/:userId", 
    param("userId").notEmpty(), 
    validate, 
async (req, res) => {
    const data = await usersService.getUser(
        req.params.userId
    );
    res.send(data)
});

module.exports = router;
