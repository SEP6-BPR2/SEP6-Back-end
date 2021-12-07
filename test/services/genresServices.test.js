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
            sinon.stub(genresModel, "getAllGenres").returns([{genreName: "opera"}]) 
            
            const data = await genresService.getAllGenres() 
            
            assertEquals(data.genres[0], "opera")
            assertEquals(data.genres[1], "any")
        })

        it("getAllGenres OK N/A", async () => {
            sinon.stub(genresModel, "getAllGenres").returns([{genreName: "N/A"}]) 
            
            const data = await genresService.getAllGenres() 
            
            assertEquals(data.genres[0], "any")
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}