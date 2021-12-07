const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const exampleService = require('../../services/exampleService') 

describe("example api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    it("parameters test", async () => {
        const response = await request.get("/example/query/test")

        assertEquals(response.text, 'SEP6 BACKEND WORKS! The name is test') 
    })

    it("body test", async () => {
        const response = await request.get("/example/body").send({data:"test"})

        assertEquals(response.text, 'SEP6 BACKEND WORKS! the body is {"data":"test"}') 
    })

    it("service test", async () => {
        sinon.stub(exampleService, "getExample").returns("Test worked")

        const response = await request.get("/example/service")

        assertEquals(response.text, 'SEP6 BACKEND WORKS!\n"Test worked"') 
    })

})


function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}