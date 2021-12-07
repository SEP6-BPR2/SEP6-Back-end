const supertest = require("supertest")
process.env.jwtValidation = "disabled"
process.env.GCPDBUSER = "testing"
process.env.redis = "disabled"
const server = require("../../server")
const app = server.startServer()
const request = supertest(app)
const sinon = require('sinon')

//Imports in file being tested
const commentService = require('../../services/commentService') 

describe("Users api testing", () => {

    afterEach(function () {
        sinon.restore() 
        process.env.jwtValidation = "disabled"
        process.env.redis = "disabled"
    })

    describe("get comments", () => {
        it("get comments OK", async () => {
            sinon.stub(commentService, "getComments").returns("Test worked")

            const response = await request.get("/comments/123456/10/2")

            assertEquals(response.text, "Test worked")
        })

        it("get comments ERROR lower bound", async () => {
            sinon.stub(commentService, "getComments").returns("Test worked")

            const response = await request.get("/comments/0/0/-1")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 3)
        })

        it("get comments OK lower bound", async () => {
            sinon.stub(commentService, "getComments").returns("Test worked")

            const response = await request.get("/comments/1/1/0")

            assertEquals(response.text, "Test worked")
        })

        it("get comments ERROR upper bound", async () => {
            sinon.stub(commentService, "getComments").returns("Test worked")

            const response = await request.get("/comments/10000000/1001/10000000")

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 3)
        })

        it("get comments OK upper bound", async () => {
            sinon.stub(commentService, "getComments").returns("Test worked")

            const response = await request.get("/comments/9999999/1000/9999999")

            assertEquals(response.text, "Test worked")
        })
    })

    describe("post comments", () => {
        it("post comments OK", async () => {
            sinon.stub(commentService, "postComment").returns("Test worked")

            const response = await request.post("/comments/0000000000000000000000000000/123456")
            .send(
                {
                    "replyCommentId": 11,
                    "text": "TEXT FOR COMMENT HERE"
                } 
            )

            assertEquals(response.status, 200)
        })

        it("post comments OK null reply", async () => {
            sinon.stub(commentService, "postComment").returns("Test worked")

            const response = await request.post("/comments/0000000000000000000000000000/123456")
            .send(
                {
                    "replyCommentId": null,
                    "text": "TEXT FOR COMMENT HERE"
                } 
            )

            assertEquals(response.status, 200)
        })

        it("post comments OK lower bound", async () => {
            sinon.stub(commentService, "postComment").returns("Test worked")

            const response = await request.post("/comments/0000000000000000000000000000/1")
            .send(
                {
                    "replyCommentId": 1,
                    "text": "T"
                } 
            )

            assertEquals(response.status, 200)
        })

        it("post comments OK upper bound", async () => {
            sinon.stub(commentService, "postComment").returns("Test worked")

            const response = await request.post("/comments/00000000000000000000000000000000000/9999999")
            .send(
                {
                    "replyCommentId": 9999999,
                    "text": "h747SJybvmZk3MvLiZ5IGZRHpbh1SoHe8dYLLoJSa7h7Gd6WXIIphmhYjP3kBQMKlKCyMX1T47f1FMBpwwbuypu4hQa5rdlSVDs9hjzVsllCjrIVrdBkFFExDe6Eboe74ukM5ARMtVu2Ek6LUsCab9kfGbziiNvxId4Ud0TsYoLbmS7AE6yQk5Kel5ACIMKSue4cFHoOcLi50u9wCBW7mUnhO9WgfPjs4HZ8k1C3mzOniBYhDO7npjrCKzCJlAQBONK96r0GTIhxdfl63zEAg7d1tFfI7xr6UaMyqOt4n68cwALkCx98xPNyaKSxZ30OUD6MCpKk7qiaNdFAjmjPDO97UBqkwpyorbEDSDiYiMCtDbacj9JiTpNCjOfYK9birtfDXFyX9vLfy5hQyRglyfTWbsypct1nKYYdpblj7s33kBH852c8fWo5H2LQLAIAazAbcjYQH04lbp2dMjLwBMYIDmk6uzenbICYIZGJRuRWG6nLeEzinN89ll5vSJKllOR1ggGniddCXw6F4R5TcSI3bs8AOUvhXDV6gixKn4M4WolZqwRe9CAJvP5s0GYcv4ujXsQiW26zlAOvO6JVsaH4HgJGvETM491l0gxuVPqTlqg4zBUZyVDwaqGAmOSejeVNNOGrB7VWAMZq9h5uDpissBpysYr1PLAKpmzDbTwLTzIjnCAhH10aVq1TR9ED6yGMxbROdg2UpHOv79Bb9gpIUBDqYkaByv2jikBL6bxPHd4tBJBgWtPbHAvkxjTy1YKMfzazAPSYHR2uPQH5ua51ylqVhbLNVEzqGC4KlypirX0CcQwq5p04OyoPe0v83eHQ3ZNyLtpneyPjMaNogu4qUP9rLSZijuUmTXFWxjtkE9n9kXpTLIWQnxh46OSMIyl4eF6Wc6iVCFTi7lvyg7GWm6t1ORUDBjNjt5S5nPY5rNQUEAa2pwiFmbcYRUNFe6Yu4PhnQtDkzc0ofyugIa1064cnS30gJ8kEDLLI"
                } 
            )

            assertEquals(response.status, 200)
        })

        it("post comments ERROR lower bound", async () => {
            const response = await request.post("/comments/000000000000000000000000000/0")
            .send(
                {
                    "replyCommentId": 0,
                    "text": ""
                } 
            )

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 4)
        })

        it("post comments ERROR upper bound", async () => {
            const response = await request.post("/comments/000000000000000000000000000000000000/10000000")
            .send(
                {
                    "replyCommentId": 10000000,
                    "text": "ah747SJybvmZk3MvLiZ5IGZRHpbh1SoHe8dYLLoJSa7h7Gd6WXIIphmhYjP3kBQMKlKCyMX1T47f1FMBpwwbuypu4hQa5rdlSVDs9hjzVsllCjrIVrdBkFFExDe6Eboe74ukM5ARMtVu2Ek6LUsCab9kfGbziiNvxId4Ud0TsYoLbmS7AE6yQk5Kel5ACIMKSue4cFHoOcLi50u9wCBW7mUnhO9WgfPjs4HZ8k1C3mzOniBYhDO7npjrCKzCJlAQBONK96r0GTIhxdfl63zEAg7d1tFfI7xr6UaMyqOt4n68cwALkCx98xPNyaKSxZ30OUD6MCpKk7qiaNdFAjmjPDO97UBqkwpyorbEDSDiYiMCtDbacj9JiTpNCjOfYK9birtfDXFyX9vLfy5hQyRglyfTWbsypct1nKYYdpblj7s33kBH852c8fWo5H2LQLAIAazAbcjYQH04lbp2dMjLwBMYIDmk6uzenbICYIZGJRuRWG6nLeEzinN89ll5vSJKllOR1ggGniddCXw6F4R5TcSI3bs8AOUvhXDV6gixKn4M4WolZqwRe9CAJvP5s0GYcv4ujXsQiW26zlAOvO6JVsaH4HgJGvETM491l0gxuVPqTlqg4zBUZyVDwaqGAmOSejeVNNOGrB7VWAMZq9h5uDpissBpysYr1PLAKpmzDbTwLTzIjnCAhH10aVq1TR9ED6yGMxbROdg2UpHOv79Bb9gpIUBDqYkaByv2jikBL6bxPHd4tBJBgWtPbHAvkxjTy1YKMfzazAPSYHR2uPQH5ua51ylqVhbLNVEzqGC4KlypirX0CcQwq5p04OyoPe0v83eHQ3ZNyLtpneyPjMaNogu4qUP9rLSZijuUmTXFWxjtkE9n9kXpTLIWQnxh46OSMIyl4eF6Wc6iVCFTi7lvyg7GWm6t1ORUDBjNjt5S5nPY5rNQUEAa2pwiFmbcYRUNFe6Yu4PhnQtDkzc0ofyugIa1064cnS30gJ8kEDLLI"
                } 
            )

            const data = JSON.parse(response.text)

            assertEquals(data.errors.length, 4)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw Error("Failed assert")
}