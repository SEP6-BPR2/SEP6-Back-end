const express = require('express') 
require('dotenv').config() 
const cors = require('cors')

// Routes that contain the endpoints
function initializeRoutes(){
    app.use("/example", require("./apis/example")) 
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
function initializeMiddleware(){
    app.use(cors())
    app.use(express.json())
    app.use(require("./middleware/errorMiddleware"))
    // app.use(require('./middleware/exampleMiddleware')) 
    if(process.env.redis){
        app.use(require('./middleware/redisMiddleware').redisGet) 
    }

}

function initializeFirebaseAdmin(){
    require("./models/connections/firebaseAdminConnection")
}

//Start server
const app = express()

initializeFirebaseAdmin()
initializeMiddleware()
initializeRoutes()

const PORT = process.env.PORT || 8888 
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`)) 