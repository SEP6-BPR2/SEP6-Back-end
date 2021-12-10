require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const usersModel = require('../../models/usersModel') 
const usersService = require('../../services/usersService') 
const sinon = require('sinon')

describe("User service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    describe("registerUser", () => {
        it("registerUser OK create new", async () => {
            sinon.stub(usersModel, "getUser").returns([{user: "exists"}]) 
            sinon.stub(usersModel, "updateUser")
            sinon.stub(usersModel, "insertUser")
            sinon.stub(usersModel, "insertFavoriteList")

            const data = await usersService.registerUser("UserId", "nickname", "URL") 
            
            assertEquals(data.user, "exists")
        })

        it("registerUser OK replace", async () => {
            let getUser = sinon.stub(usersModel, "getUser").returns([]) 
            getUser.onCall(0).returns([]);
            getUser.onCall(1).returns([{user: "exists"}]);
            sinon.stub(usersModel, "insertUser")
            sinon.stub(usersModel, "insertFavoriteList")

            const data = await usersService.registerUser("UserId", "nickname", "URL") 
            
            assertEquals(data.user, "exists")
        })
    })

    describe("getUser", () => {

        it("getUser OK", async () => {
            sinon.stub(usersModel, "getUser").returns([{user: "exists"}]) 

            const data = await usersService.getUser("UserId") 
            
            assertEquals(data.user, "exists")
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}