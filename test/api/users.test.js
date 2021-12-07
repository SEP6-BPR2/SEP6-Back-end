const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.GCPDBUSER = "testing"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const usersService = require('../../services/usersService') 

describe("Users api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    describe("register user", () => {
        it("register user OK", async () => {
            sinon.stub(usersService, "registerUser").returns("Test worked")

            const response = await request.post("/users/register/0000000000000000000000000000/1111111")

            assertEquals(response.text, "Test worked")
        })

        it("register user OK lower bound", async () => {
            sinon.stub(usersService, "registerUser").returns("Test worked")

            const response = await request.post("/users/register/0000000000000000000000000000/11111")

            assertEquals(response.text, "Test worked")
        })

        it("register user ERROR lower bound", async () => {
            sinon.stub(usersService, "registerUser").returns("Test worked")

            const response = await request.post("/users/register/000000000000000000000000000/1111")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })

        it("register user OK upper bound", async () => {
            sinon.stub(usersService, "registerUser").returns("Test worked")

            const response = await request.post("/users/register/00000000000000000000000000000000000/00000000000000000000000000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("register user ERROR upper bound", async () => {
            sinon.stub(usersService, "registerUser").returns("Test worked")

            const response = await request.post("/users/register/000000000000000000000000000000000000/000000000000000000000000000000000000000000000000000")
            
            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 2)
        })
    })

    describe("get user", () => {
        it("get user OK ", async () => {
            sinon.stub(usersService, "getUser").returns("Test worked")

            const response = await request.get("/users/0000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get user OK lower bound", async () => {
            sinon.stub(usersService, "getUser").returns("Test worked")

            const response = await request.get("/users/0000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get user ERROR lower bound", async () => {
            sinon.stub(usersService, "getUser").returns("Test worked")

            const response = await request.get("/users/000000000000000000000000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 1)
        })

        it("get user OK upper bound", async () => {
            sinon.stub(usersService, "getUser").returns("Test worked")

            const response = await request.get("/users/00000000000000000000000000000000000")

            assertEquals(response.text, "Test worked")
        })

        it("get user ERROR upper bound", async () => {
            sinon.stub(usersService, "getUser").returns("Test worked")

            const response = await request.get("/users/000000000000000000000000000000000000")
            
            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 1)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}