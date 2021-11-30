const express = require('express');
const router = express.Router();
const usersService = require('../services/usersService');

router.post("/register/:userId/:nickname", async (req, res) => {
    const data = await usersService.registerUser(
        req.params.userId, 
        req.params.nickname
    );
    res.send(data)
});

router.get("/:userId", async (req, res) => {
    const data = await usersService.getUser(
        req.params.userId
    );
    res.send(data)
});

module.exports = router;
