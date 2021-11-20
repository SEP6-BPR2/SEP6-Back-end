const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config(); // Initialize env

function initializeRoutes(app){
    app.use("/example", require("./apis/example"));
    app.use("/movies", require("./apis/seeMovies"));

    /**
     * @swagger
     * /:
     *  get:
     *      description: Home page.
     */
    app.get("/", (req, res) => {
        res.send("SEP6 BACKEND WORKS!");
    });
}

function initializeMiddleware(app){
    app.use(express.json());
    app.use(require('./middleware/exampleMiddleware'));
}

// async function initializeThirdPartyAPIS(){
//     //Get current state of third party website and use it to set some environment variables.
//     const response = await fetch("https://api.themoviedb.org/3/configuration?api_key=" + process.env.THEMOVIEDBKEY);
//     const body = await response.text();
//     const object = JSON.parse(body);
//     process.env.base_url = object.images.base_url
//     // console.log(body);
//     console.log("Third party environment initialized...")
// }

// function initializeSwagger(app){
//     const swaggerOptions = {
//         swaggerDefinition:{
//             info: "Sep6 API",
//             description: "API information",
//             servers: ['http://localhost:8888/']
//         },
//         apis: ['index.js', './apis/*.js']
//     };
    
//     const swaggerDocs = swaggerJsDoc(swaggerOptions);
//     app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    
// }

//Start server
const app = express();


initializeMiddleware(app);
initializeRoutes(app);
// initializeSwagger(app);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`));