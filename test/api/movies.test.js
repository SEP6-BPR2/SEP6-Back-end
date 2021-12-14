const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.GCPDBUSER = "testing"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const moviesService = require('../../services/moviesService') 

describe("Movies api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    describe("get movie list", () => {
        it("get movie list OK", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/title/10/0/Drama/1")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list OK lower bound", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/tit/1/0/Dra/0")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list OK upper bound", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/titletitletitletitle/1000/9999999/DramaDramaDramaDrama/1")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list ERROR int sorting and category", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/123/10/0/123/1")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("get movie list ERROR upper bound", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/titletitletitletitles/1001/10000000/DramaDramaDramaDramas/2")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 5)
        })

        it("get movie list ERROR lower bound", async () => {
            sinon.stub(moviesService, "getListOfMovies").returns("Test worked")

            const response = await request.get("/movies/list/ti/0/-1/Dr/-1")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 5)
        })
    })

    describe("get movie list search", () => {
        it("get movie list search OK", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            const response = await request.get("/movies/search/title/10/0/Drama/1/Sata")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list search OK lower bound", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            const response = await request.get("/movies/search/tit/1/0/Dra/0/S")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list search OK upper bound", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            const response = await request.get("/movies/search/titletitletitletitle/1000/9999999/DramaDramaDramaDrama/1/JdlF9nF1oa04wOBv6QmWacuM1M33RkFAKTdOT4xYEy98G3XJ5OyIiSu0sjGmhLcHGvbxMacCXL4E5JcMP20cqMf6DIqGUGfu314l")

            assertEquals(response.text, "Test worked")
        })

        it("get movie list ERROR int sorting and category", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            const response = await request.get("/movies/search/123/10/0/123/1/Satan")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("get movie list search ERROR upper bound", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            const response = await request.get("/movies/search/titletitletitletitles/1001/10000000/DramaDramaDramaDramas/2/JdlF9nF1oa04wOBv6QmWacuM1M33RkFAKTdOT4xYEy98G3XJ5OyIiSu0sjGmhLcHGvbxMacCXL4E5JcMP20cqMf6DIqGUGfu314la")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 6)
        })

        it("get movie list search ERROR lower bound", async () => {
            sinon.stub(moviesService, "getBySearch").returns("Test worked")

            //Cant test movie name as empty string because the request just fails
            //That is the correct scenario
            const response = await request.get("/movies/search/ti/0/-1/Dr/-1/a")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 5)
        })
    })

    describe("get movie details", () => {
        it("get movie details OK with user id", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/54724/1/0000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get movie details OK without userId", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/54724/0/none")

            assertEquals(response.text, "Test worked")
        })

        it("get movie details OK with userId lower bound", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/1/1/0000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get movie details OK with userId upper bound", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/9999999/1/00000000000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get movie details ERROR with userId lower bound", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/0/1/000000000000000000000000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)        
        })

        it("get movie details ERROR with userId upper bound", async () => {
            sinon.stub(moviesService, "getMovieDetailsAndFavorites").returns("Test worked")

            const response = await request.get("/movies/details/10000000/1/000000000000000000000000000000000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)        
        })
    })

    describe("get sorting", () => {
        it("get sorting OK", async () => {
            sinon.stub(moviesService, "getSortingMethods").returns("Test worked")

            const response = await request.get("/movies/sorting")

            assertEquals(response.text, "Test worked")
        })
    })
})


function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}