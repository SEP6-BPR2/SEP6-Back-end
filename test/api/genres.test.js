const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.GCPDBUSER = "testing"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const genresService = require('../../services/genresService') 

describe("Users api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    describe("get genres list", () => {
        it("get genres list OK", async () => {
            sinon.stub(genresService, "getAllGenres").returns("Test worked")

            const response = await request.get("/genres/all")

            assertEquals(response.text, "Test worked")
        })
    })
})


function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}