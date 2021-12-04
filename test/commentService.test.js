require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const commentModel = require('../models/commentModel') 
const commentService = require('../services/commentService') 
const sinon = require('sinon')

describe("Comment service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    it("getComments", async () => {
        sinon.stub(commentModel, "getCommentsForMovie").returns("test worked") 

        const data = await commentService.getComments(123456)
        
        assertEquals(data, "test worked")
    }) 

    it("postComment", async () => {
        sinon.stub(commentModel, "postComment").returns("test worked") 

        const data = await commentService.postComment(
            "userId", 
            123456, 
            {
                replyCommentId: null,
                text: "TEXT FOR COMMENT HERE"
            }
        )

        assertEquals(data, "test worked")
    }) 
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}