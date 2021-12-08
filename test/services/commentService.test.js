require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const commentModel = require('../../models/commentModel') 
const commentService = require('../../services/commentService') 
const sinon = require('sinon')

describe("Comment service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    it("getCommentsFirstOrder", async () => {
        sinon.stub(commentModel, "getFirstOrderCommentsForMovie").returns("test worked") 

        const data = await commentService.getCommentsFirstOrder(123456, 1, 1)
        
        assertEquals(data, "test worked")
    }) 

    it("getCommentsSecondOrder", async () => {
        sinon.stub(commentModel, "getSecondOrderCommentsForMovie").returns("test worked") 

        const data = await commentService.getCommentsSecondOrder(123456, 1, 1, 1)
        
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
    if(value1 != value2) throw Error("Failed assert")
}