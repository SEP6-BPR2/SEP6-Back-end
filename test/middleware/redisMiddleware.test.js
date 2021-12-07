require('dotenv').config()
process.env.redis = "disabled"
const redisClient = require("../../models/connections/redisConnection")
const sinon = require('sinon')
const redisMiddleware = require('../../middleware/redisMiddleware')

describe("redis middleware testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.redis = "disabled"
    }) 

    describe("redisGet", () => {
        it("redisGet OK returned from redis NORMAL", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    get: (url, callback) => {
                        callback(null, "data")
                    }
                }
            ) 

            const res = {
                send: (text) =>{
                    assertEquals(text, "data")
                }
            }

            const next = () => {}

            const req = {
                originalUrl: "URL",
            }
            process.env.redis = "normal"

            redisMiddleware.redisGet(req, res, next)
        })

        it("redisGet OK returned from redis LOCAL", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    get: (url, callback) => {
                        callback(null, "data")
                    }
                }
            ) 

            const res = {
                send: (text) =>{
                    assertEquals(text, "data")
                }
            }

            const next = () => {}

            const req = {
                originalUrl: "URL",
            }
            process.env.redis = "local"

            redisMiddleware.redisGet(req, res, next)
        })

        it("redisGet OK redis does not have data", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    get: (url, callback) => {
                        callback(null, null)
                    }
                }
            ) 

            const res = {
                send: (text) =>{
                }
            }

            const next = () => {

            }

            const req = {
                originalUrl: "URL",
            }
            process.env.redis = "normal"

            redisMiddleware.redisGet(req, res, next)
        })

        it("redisGet ERROR", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    get: (url, callback) => {
                        callback("error", null)
                    }
                }
            ) 

            const res = {
                send: (text) =>{
                }
            }

            const next = () => {

            }

            const req = {
                originalUrl: "URL",
            }
            process.env.redis = "normal"

            redisMiddleware.redisGet(req, res, next)
        })

        it("redisGet DISABLED", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    get: (url, callback) => {
                        callback("error", null)
                    }
                }
            ) 

            const res = {
                send: (text) =>{
                }
            }

            const next = () => {

            }

            const req = {
                originalUrl: "URL",
            }
            process.env.redis = "disabled"

            redisMiddleware.redisGet(req, res, next)
        })
    })

    describe("redisSet", () => {
        it("redisSet OK local", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    setex: () => {}
                }
            ) 
            process.env.redis = "local"

            redisMiddleware.redisSet("key", "value")
        })

        it("redisSet OK normal", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    setex: () => {}
                }
            ) 
            process.env.redis = "normal"

            redisMiddleware.redisSet("key", "value")
        })

        it("redisSet Pass disabled", async () => {
            sinon.stub(redisClient, "client").returns(
                {
                    setex: () => {}
                }
            ) 
            process.env.redis = "disabled"

            redisMiddleware.redisSet("key", "value")
        })

        it("redisSet Pass no value", async () => {
            process.env.redis = "normal"

            redisMiddleware.redisSet("key", null)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}