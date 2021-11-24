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
    if(process.env.redis){
        app.use(require('./middleware/redisMiddleware').redisGet);
    }
}

//Start server
const app = express();
const redis = require('redis');



data()

async function data(){
    const client = redis.createClient({
        host: process.env.redis_network,
        port: process.env.redis_port,
        auth_pass: process.env.redis_password
    });
    
    await client.setex("keysdasd", 3600, 22115155);
    console.log("Set key")
    await client.get("keysdasd", (error, data) =>{
        if(error) throw err
        con
        console.log("got key ")
        console.log(data);
    });
}

initializeMiddleware(app);
initializeRoutes(app);
// initializeSwagger(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));