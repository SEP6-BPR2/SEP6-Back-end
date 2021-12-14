require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const commentsModel = require('../../models/commentsModel') 
const commentsService = require('../../services/commentsService') 
const sinon = require('sinon')

describe("Comment service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    it("getCommentsFirstOrder", async () => {
        sinon.stub(commentsModel, "getFirstOrderCommentsForMovie").returns("test worked") 

        const data = await commentsService.getCommentsFirstOrder(123456, 1, 1)
        
        assertEquals(data, "test worked")
    }) 

    it("getCommentsSecondOrder", async () => {
        sinon.stub(commentsModel, "getSecondOrderCommentsForMovie").returns("test worked") 

        const data = await commentsService.getCommentsSecondOrder(123456, 1, 1, 1)
        
        assertEquals(data, "test worked")
    }) 

    it("postComment", async () => {
        sinon.stub(commentsModel, "postComment").returns("test worked") 

        const data = await commentsService.postComment(
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