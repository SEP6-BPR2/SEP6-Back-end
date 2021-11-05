const express = require('express');
require('dotenv').config(); // Initialize env

function initializeRoutes(app){
    app.use("/example", require("./apis/example"));

    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND WORKS!");
    });
}

function initializeMiddleware(app){
    app.use(express.json());
}


//Start server
const app = express();

initializeMiddleware(app);
initializeRoutes(app);

app.listen(9000, () => console.log(`Server started on http://localhost:${9000}/`));