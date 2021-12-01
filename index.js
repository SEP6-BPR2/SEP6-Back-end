const express = require('express');
require('dotenv').config();
const cors = require('cors')

// Routes that contain the endpoints
function initializeRoutes(app){
    app.use("/example", require("./apis/example"));
    app.use("/movies", require("./apis/movies"));
    app.use("/genres", require("./apis/genres"));
    app.use("/favorites", require("./apis/favorites"));
    app.use("/users", require("./apis/users"));
    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND: V1");
    });
}

// Functions that are called before the actual endpoint is reached
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

initializeMiddleware(app);
initializeRoutes(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));