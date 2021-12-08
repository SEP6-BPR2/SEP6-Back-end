const express = require('express') 
const router = express.Router() 
const { redisSet } = require("../middleware/redisMiddleware")
const moviesService = require('../services/moviesService') 
const { param } = require('express-validator') 
const { validate } = require("../middleware/validateMiddleware")

/**
 * Get list of movies
 * @param sorting - string, what parameter in movie object to sort by
 * @param number - int, how many movies to return
 * @param offset - int, how many movies to skip by
 * @param category - string, how many movies to return
 * @param descending - 1 or 0, 1 - sort and show descending, 0 - sort and show ascending 
 * 
 * @example - GET {BaseURL}/movies/list/title/10/0/Drama/1
 */
router.get("/list/:sorting/:number/:offset/:category/:descending", 
    param("sorting").isLength({min: 3, max: 20}).not().isInt(), 
    param("number").isInt({min:1 ,max:1000}),
    param("offset").isInt({min:0 ,max:9999999}),
    param("category").isLength({min: 3, max: 20}).not().isInt(),
    param("descending").isInt({min:0, max:1}),
    validate,
async (req, res) => {
    const data = await moviesService.getListOfMovies(
        req.params.sorting, 
        parseInt(req.params.number), 
        parseInt(req.params.offset), 
        req.params.category, 
        parseInt(req.params.descending)
    ) 

    redisSet(req.originalUrl, data) 
    
    res.send(data)
}) 

/**
 * Get more info about specific movie
 * @param movieId - string, id of the movie 
 * @param checkFavorites - bool int, 1 or 0 to check if favorite or not
 * @param userId - string, id of user for which to check if favorite
 * 
 * @example - GET {BaseURL}/movies/details/54724/1/123456
 */
router.get("/details/:movieId/:checkFavorites/:userId",
    param("movieId").isInt({min:1 ,max:9999999}), 
    param("checkFavorites").isInt({min:0, max:1}),
    param("userId").custom((value, {req}) => checkUserIdOrNull(value, req.params.checkFavorites)), 
    validate,
async (req, res) => {
    const data = await moviesService.getMovieDetailsAndFavorites(
        parseInt(req.params.movieId),
        parseInt(req.params.checkFavorites),
        req.params.userId
    ) 

    res.send(data) 
}) 

/**
 * Search for movie by partial string or full string. Same like list but with search functionality
 * @param sorting - string, what parameter in movie object to sort by
 * @param number - int, how many movies to return
 * @param offset - int, how many movies to skip by
 * @param category - string, how many movies to return
 * @param descending - 1 or 0, 1 - sort and show descending, 0 - sort and show ascending 
 * @param movieName - string, partial or full string of movie
 * 
 * @example - GET {BaseURL}/movies/search/title/10/0/Drama/1/Sata
 */
router.get("/search/:sorting/:number/:offset/:category/:descending/:movieName", 
    param("sorting").isLength({min: 3, max: 20}).not().isInt(), 
    param("number").isInt({min:1 ,max:1000}),
    param("offset").isInt({min:0 ,max:9999999}),
    param("category").isLength({min: 3, max: 20}).not().isInt(),
    param("descending").isInt({min:0, max:1}),
    param("movieName").isLength({min: 1, max: 100}),
    validate,
async (req, res) => {
    const data = await moviesService.getBySearch(
        req.params.sorting, 
        parseInt(req.params.number), 
        parseInt(req.params.offset), 
        req.params.category, 
        parseInt(req.params.descending), 
        req.params.movieName
    ) 

    redisSet(req.originalUrl, data) 
    // redisSet(req.originalUrl + "/" + req.body.movieName, data) 

    res.send(data)
}) 

/**
 * Get list of available sorting parameters for movies endpoints
 * 
 * @example - GET {BaseURL}/movies/sorting
 */
router.get("/sorting",  (req, res) => {
    const data = moviesService.getSortingMethods();
    redisSet(req.originalUrl, data);
    res.send(data)
}) 

/**
 * TEMPORARY Find movies without a poster and try to update the posters from fallback third party api
 * 
 * @example - GET {BaseURL}/movies/update
 */
router.get("/update", async (req, res) => {
    moviesService.update() 
    res.sendStatus(200)
}) 

function checkUserIdOrNull(value, checkUserId){
    if(checkUserId == 1 ){
        if(value.length >= 28 && value.length <= 35 ){
            return true
        }else{
            throw new Error('Value is out of bounds');
        }
    }else if(checkUserId == 0 && value == "none"){
        return true
    }else{
        throw new Error('User id must be "none" if disabled');
    }
}

module.exports = router 