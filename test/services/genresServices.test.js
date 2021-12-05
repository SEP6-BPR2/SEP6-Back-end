require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const genresModel = require('../../models/genresModel') 
const genresService = require('../../services/genresService') 
const sinon = require('sinon')

describe("Genre service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    describe("getAllGenres", () => {
        it("getAllGenres OK", async () => {
            sinon.stub(genresModel, "getAllGenres").returns("Test works") 
            
            const data = await genresService.getAllGenres() 
            
            assertEquals(data, "Test works")
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}