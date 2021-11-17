const express = require('express');
const router = express.Router();
const exampleService = require('../services/exampleService');

/**
 * @swagger
 * /example/query/<name>:
 *  get:
 *      summary: Test out variable passing
 *      responses:
 *          200:
 *              description: Name is returned
 */

router.get("/query/:name", async (req, res) => {
    res.send("SEP6 BACKEND WORKS! The name is " + req.params.name);
});

/**
 * @swagger
 * /example/body:
 *  get:
 *      summary: Test out body passing
 *      responses:
 *          200:
 *              description: Body and string are returned
 */
router.get("/body", async (req, res) => {
    res.send("SEP6 BACKEND WORKS! the body is " + JSON.stringify(req.body));
});

/**
 * @swagger
 * /example/service:
 *  get:
 *      summary: Test out service calling
 *      responses:
 *          200:
 *              description: Get a call that is returned from service layer.
 */
router.get("/service", async (req, res) => {
    const data = await exampleService.getExample();

    res.send("SEP6 BACKEND WORKS!" + "\n"+ JSON.stringify(data));
});

module.exports = router;