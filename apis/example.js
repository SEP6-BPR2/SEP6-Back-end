
const express = require('express');
const router = express.Router();
const exampleService = require('../services/exampleService');

router.get("/query/:name", async (req, res) => {
    res.send("SEP6 BACKEND WORKS! The name is " + req.params.name);
});

router.get("/body", async (req, res) => {
    res.send("SEP6 BACKEND WORKS! the body is " + JSON.stringify(req.body));
});

router.get("/service", async (req, res) => {
    const data = await exampleService.getExample();

    res.send("SEP6 BACKEND WORKS!" + "\n"+ JSON.stringify(data));
});

module.exports = router;