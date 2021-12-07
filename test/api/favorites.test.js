const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const favoritesService = require('../../services/favoritesService') 

describe("Users api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    describe("get favorites list", () => {
        it("get favorites OK", async () => {
            sinon.stub(favoritesService, "getFavoritesList").returns("Test worked")

            const response = await request.get("/favorites/00000000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get favorites OK lower bound", async () => {
            sinon.stub(favoritesService, "getFavoritesList").returns("Test worked")

            const response = await request.get("/favorites/0000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get favorites OK upper bound", async () => {
            sinon.stub(favoritesService, "getFavoritesList").returns("Test worked")

            const response = await request.get("/favorites/00000000000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get favorites ERROR lower bound", async () => {
            sinon.stub(favoritesService, "getFavoritesList").returns("Test worked")

            const response = await request.get("/favorites/00000000000000000000000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 1)
        })

        it("get favorites ERROR upper bound", async () => {
            sinon.stub(favoritesService, "getFavoritesList").returns("Test worked")

            const response = await request.get("/favorites/000000000000000000000000000000000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 1)
        })

    })

    describe("add favorite movie", () => {
        it("add favorite movie OK", async () => {
            sinon.stub(favoritesService, "addMovieToFavoritesList").returns(200)

            const response = await request.post("/favorites/00000000000000000000000000000000/146870")

            assertEquals(response.status, 200)
        })

        it("add favorite movie OK lower bound", async () => {
            sinon.stub(favoritesService, "addMovieToFavoritesList").returns(200)

            const response = await request.post("/favorites/0000000000000000000000000000/1")

            assertEquals(response.status, 200)
        })

        it("add favorite movie OK upper bound", async () => {
            sinon.stub(favoritesService, "addMovieToFavoritesList").returns(200)

            const response = await request.post("/favorites/00000000000000000000000000000000000/9999999")

            assertEquals(response.status, 200)
        })

        it("add favorite movie ERROR lower bound", async () => {
            sinon.stub(favoritesService, "addMovieToFavoritesList").returns("Test worked")

            const response = await request.post("/favorites/000000000000000000000000000/0")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("add favorite movie ERROR upper bound", async () => {
            sinon.stub(favoritesService, "addMovieToFavoritesList").returns("Test worked")

            const response = await request.post("/favorites/000000000000000000000000000000000000/10000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })
    })

    describe("remove favorite movie", () => {
        it("remove favorite movie OK", async () => {
            sinon.stub(favoritesService, "removeMovieFromFavoritesList").returns(200)

            const response = await request.delete("/favorites/00000000000000000000000000000000/146870")

            assertEquals(response.status, 200)
        })

        it("remove favorite movie OK lower bound", async () => {
            sinon.stub(favoritesService, "removeMovieFromFavoritesList").returns(200)

            const response = await request.delete("/favorites/0000000000000000000000000000/1")

            assertEquals(response.status, 200)
        })

        it("remove favorite movie OK upper bound", async () => {
            sinon.stub(favoritesService, "removeMovieFromFavoritesList").returns(200)

            const response = await request.delete("/favorites/00000000000000000000000000000000000/9999999")

            assertEquals(response.status, 200)
        })

        it("remove favorite movie ERROR lower bound", async () => {
            sinon.stub(favoritesService, "removeMovieFromFavoritesList").returns("Test worked")

            const response = await request.delete("/favorites/000000000000000000000000000/0")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("remove favorite movie ERROR upper bound", async () => {
            sinon.stub(favoritesService, "removeMovieFromFavoritesList").returns("Test worked")

            const response = await request.delete("/favorites/000000000000000000000000000000000000/10000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })
    })

    describe("check if favorite movie", () => {
        it("check if favorite movie OK", async () => {
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns("Test worked")

            const response = await request.get("/favorites/inFavorites/00000000000000000000000000000000/146870")

            assertEquals(response.text, "Test worked")
        })

        it("check if favorite movie OK lower bound", async () => {
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns("Test worked")

            const response = await request.get("/favorites/inFavorites/0000000000000000000000000000/1")

            assertEquals(response.text, "Test worked")
        })

        it("check if favorite movie OK upper bound", async () => {
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns("Test worked")

            const response = await request.get("/favorites/inFavorites/00000000000000000000000000000000000/9999999")

            assertEquals(response.text, "Test worked")
        })

        it("check if favorite movie ERROR lower bound", async () => {
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns("Test worked")

            const response = await request.get("/favorites/inFavorites/000000000000000000000000000/0")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("check if favorite movie ERROR upper bound", async () => {
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns("Test worked")

            const response = await request.get("/favorites/inFavorites/000000000000000000000000000000000000/10000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })
    })

})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}