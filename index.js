const express = require('express');
require('dotenv').config(); // Initialize env

function initializeRoutes(app){
    app.use("/example", require("./apis/example"));
    app.use("/movies", require("./apis/movies"));

    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND WORKS!");
    });
}

function initializeMiddleware(app){
    app.use(express.json());
    app.use(require('./middleware/exampleMiddleware'));
    app.use(require('./middleware/redisMiddleware').redisGet);
}

//Start server
const app = express();


initializeMiddleware(app);
initializeRoutes(app);
// initializeSwagger(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));