require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const favoritesModel = require('../models/favoritesModel') 
const usersModel = require('../models/usersModel') 
const favoritesService = require('../services/favoritesService') 
const sinon = require('sinon')
const assert = require('assert')

describe("Favorite service testing", () => {

    afterEach(function () {
        sinon.restore() 
    })

    describe("getFavoritesList", () => {
        it("getFavoritesList OK", async () => {
            sinon.stub(usersModel, "getUser").returns([{ nickname: "nickname"}])
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}])
            sinon.stub(favoritesModel, "getFavoritesListMovies").returns([{movie: "name"}])
    
            const data = await favoritesService.getFavoritesList("UserId")
    
            assertEquals(data.author, "nickname")
        }) 

        it("getFavoritesList favorite list not found", async () => {
            sinon.stub(usersModel, "getUser").returns([{ nickname: "nickname"}])
            sinon.stub(favoritesModel, "getFavoritesList").returns([])
    
            const data = await favoritesService.getFavoritesList("UserId")
    
            assertEquals(data.author, null)
            assertEquals(data.movies, null)
        }) 

        it("getFavoritesList favorite list not found null", async () => {
            sinon.stub(usersModel, "getUser").returns([{ nickname: "nickname"}])
            sinon.stub(favoritesModel, "getFavoritesList").returns(null)
            sinon.stub(favoritesModel, "getFavoritesListMovies").returns([{movie: "name"}])
    
            const data = await favoritesService.getFavoritesList("UserId")
    
            assertEquals(data.author, null)
            assertEquals(data.movies, null)
        }) 
    })
    
    describe("addMovieToFavoritesList", () => {
        it("addMovieToFavoritesList OK", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}])
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([])
            sinon.stub(favoritesModel, "addMovieToFavoritesList").returns([{movie: "name"}])
    
            const data = await favoritesService.addMovieToFavoritesList("userId", 123) 
    
            assertEquals(data, 200)
        })

        it("addMovieToFavoritesList relation exists", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}])
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([{relation: true}])
            sinon.stub(favoritesModel, "addMovieToFavoritesList").returns([{movie: "name"}])
    
            const data = await favoritesService.addMovieToFavoritesList("userId", 123) 
    
            assertEquals(data, 403)
        })

        it("addMovieToFavoritesList no favorite list", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([])
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([{relation: true}])
            sinon.stub(favoritesModel, "addMovieToFavoritesList").returns([{movie: "name"}])
    
            const data = await favoritesService.addMovieToFavoritesList("userId", 123) 
    
            assertEquals(data, 403)
        })

        it("addMovieToFavoritesList no favorite list null", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns(null)
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([{relation: true}])
            sinon.stub(favoritesModel, "addMovieToFavoritesList").returns([{movie: "name"}])
    
            const data = await favoritesService.addMovieToFavoritesList("userId", 123) 
    
            assertEquals(data, 403)
        })
    })

    // describe("removeMovieFromFavoritesList", () => {
    //     it("removeMovieFromFavoritesList", async () => {
    //         sinon.stub(favoritesModel, "getFavoritesList").returns("test worked") 
    //         sinon.stub(favoritesModel, "getFavoritesListToMovie").returns("test worked") 
    //         sinon.stub(favoritesModel, "removeMovieFromFavoritesList").returns("test worked") 
    
    //         const data = await favoritesService.removeMovieFromFavoritesList() 
    
    //         assertEquals(data, "test worked")
    //     })
    // })

    // describe("isMovieInUserFavorites", () => {
    //     it("isMovieInUserFavorites", async () => {
    //         sinon.stub(favoritesModel, "getFavoritesList").returns("test worked") 
    //         sinon.stub(favoritesModel, "getFavoritesListToMovie").returns("test worked") 
    
    //         const data = await favoritesService.isMovieInUserFavorites() 
    
    //         assertEquals(data, "test worked")
    //     })
    // })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}