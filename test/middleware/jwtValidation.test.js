require('dotenv').config()
process.env.jwtValidation = "disabled"
const firebaseConnection = require("../../models/connections/firebaseAdminConnection")
const sinon = require('sinon')
const validateJWT = require('../../middleware/jwtValidationMiddleware')

describe("jwt validation middleware testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
    }) 


    describe("validateJWT", () => {
        it("validateJWT OK", async () => {
            sinon.stub(firebaseConnection, "auth").returns(
                {
                    verifyIdToken: (token) => {
                        return new Promise((resolve, reject) => {
                            resolve({
                                uid: "userId"
                            })
                        })
                    }
                }
            ) 

            const res = {
                status: (status) => {
                    return {send: (text) =>{
                        console.log(text)
                    }}
                }
            }
            const next = () => {}
            const req = {
                headers: {
                    authorization: "authorization"
                },
                originalUrl: "URL",
                params: {
                    userId: "userId"
                },
                body: { 
                    bodytext: "Text"
                }
            }
            process.env.jwtValidation = "enabled"

            validateJWT(req, res, next)
        })

        it("validateJWT ERROR user id's dont match", async () => {
            sinon.stub(firebaseConnection, "auth").returns(
                {
                    verifyIdToken: (token) => {
                        return new Promise((resolve, reject) => {
                            resolve({
                                uid: "userNotId"
                            })
                        })
                    }
                }
            ) 

            const res = {
                status: (status) => {
                    return {send: (text) =>{
                        assertEquals(status, 403)
                        assertEquals(text, "Unauthorized: User id from the token does not match userId from the passed parameter")
                    }}
                }
            }
            const next = () => {}
            const req = {
                headers: {
                    authorization: "authorization"
                },
                originalUrl: "URL",
                params: {
                    userId: "userId"
                },
                body: { 
                    bodytext: "Text"
                }
            }
            process.env.jwtValidation = "enabled"

            validateJWT(req, res, next)
        })

        it("validateJWT ERROR", async () => {
            sinon.stub(firebaseConnection, "auth").returns(
                {
                    verifyIdToken: (token) => {
                        return new Promise((resolve, reject) => {
                            reject({
                                error: "error happened"
                            })
                        })
                    }
                }
            ) 

            const res = {
                status: (status) => {
                    return {send: (text) =>{
                        assertEquals(status, 500)
                        assertEquals(text, "Internal server error when validating token.")
                    }}
                }
            }
            const next = () => {}
            const req = {
                headers: {
                    authorization: "authorization"
                },
                originalUrl: "URL",
                params: {
                    userId: "userId"
                },
                body: { 
                    bodytext: "Text"
                }
            }
            process.env.jwtValidation = "enabled"

            validateJWT(req, res, next)
        })

        it("validateJWT disabled", async () => {

            const next = () => {}

            process.env.jwtValidation = "disabled"

            validateJWT(null, null, next)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}