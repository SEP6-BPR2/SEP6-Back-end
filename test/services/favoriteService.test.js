require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const favoritesModel = require('../../models/favoritesModel') 
const usersModel = require('../../models/usersModel') 
const favoritesService = require('../../services/favoritesService') 
const sinon = require('sinon')

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

        it("getFavoritesList no favorite list", async () => {
            sinon.stub(usersModel, "getUser").returns([{ nickname: "nickname"}])
            sinon.stub(favoritesModel, "getFavoritesList").returns([])
    
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
    })

    describe("removeMovieFromFavoritesList", () => {
        it("removeMovieFromFavoritesList OK", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}]) 
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([{exists: true}])
            sinon.stub(favoritesModel, "removeMovieFromFavoritesList").returns("test worked") 
    
            const data = await favoritesService.removeMovieFromFavoritesList() 
    
            assertEquals(data, 200)
        })

        it("removeMovieFromFavoritesList no relation", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}]) 
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([])

            const data = await favoritesService.removeMovieFromFavoritesList() 
    
            assertEquals(data, 403)
        })

        it("removeMovieFromFavoritesList no favorites list", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([]) 

            const data = await favoritesService.removeMovieFromFavoritesList() 
    
            assertEquals(data, 403)
        })
    })

    describe("isMovieInUserFavorites", () => {
        it("isMovieInUserFavorites OK", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}]) 
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([{ relation: true}]) 
            
            const data = await favoritesService.isMovieInUserFavorites() 
            
            //Hard to compare boolean values. Turn dictionary to string and compare
            assertEquals(JSON.stringify(data), JSON.stringify({exists: true}))
        })

        it("isMovieInUserFavorites no relation", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([{ favoritesId: 123}]) 
            sinon.stub(favoritesModel, "getFavoritesListToMovie").returns([]) 
    
            const data = await favoritesService.isMovieInUserFavorites() 
    
            assertEquals(JSON.stringify(data), JSON.stringify({exists: false}))
        })

        it("isMovieInUserFavorites no favorites list", async () => {
            sinon.stub(favoritesModel, "getFavoritesList").returns([]) 
    
            const data = await favoritesService.isMovieInUserFavorites() 
    
            assertEquals(JSON.stringify(data), JSON.stringify({exists: false}))
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}