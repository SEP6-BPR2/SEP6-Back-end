const express = require('express') 
require('dotenv').config() 
const cors = require('cors')
const helmet = require("helmet");

// Routes that contain the endpoints
function initializeRoutes(app){
    app.use("/movies", require("./apis/movies")) 
    app.use("/genres", require("./apis/genres")) 
    app.use("/favorites", require("./apis/favorites")) 
    app.use("/users", require("./apis/users")) 
    app.use("/comments", require("./apis/comments")) 

    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND: V1") 
    }) 
}

// Functions that are called before the actual endpoint is reached
function initializeMiddleware(app){
    app.use(helmet())
    app.use(cors())
    app.use(express.json())
    // app.use(require("./middleware/errorMiddleware"))
    if(process.env.redis){
        app.use(require('./middleware/redisMiddleware').redisGet) 
    }
    app.use(require("./middleware/loggingMiddleware"))
}

const startServer = () => {
    const app = express()

    initializeMiddleware(app)
    initializeRoutes(app)
    
    return app
}

module.exports.startServer = startServer