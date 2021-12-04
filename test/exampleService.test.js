require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const exampleModel = require('../models/exampleModel') 
const exampleService = require('../services/exampleService') 
const sinon = require('sinon')

describe("Example service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    it("getExampleData", async () => {
        sinon.stub(exampleModel, "getExampleData").returns("test worked") 

        const data = await exampleService.getExample() 

        assertEquals(data, "test worked")
    }) 
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}