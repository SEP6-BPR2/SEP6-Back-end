const express = require('express');
require('dotenv').config(); // Initialize env
const cors = require('cors')

function initializeRoutes(app){
    app.use("/example", require("./apis/example"));
    app.use("/movies", require("./apis/movies"));
    app.
    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND WORKS!");
    });
}

function initializeMiddleware(app){
    app.use(cors())
    app.use(express.json());
    app.use(require('./middleware/exampleMiddleware'));
    if(process.env.redis){
        app.use(require('./middleware/redisMiddleware').redisGet);
    }
}

//Start server
const app = express();
const redis = require('redis');

initializeMiddleware(app);
initializeRoutes(app);
// initializeSwagger(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));