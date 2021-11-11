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
    // app.use(require("cors"));
}


//Start server
const app = express();

initializeMiddleware(app);
initializeRoutes(app);

const PORT = 9000
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));