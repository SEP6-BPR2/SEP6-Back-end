require('dotenv').config()
const errorMiddleware = require('../../middleware/errorMiddleware')

describe("Error middleware testing", () => {

    describe("errorMiddleware", () => {
        it("errorMiddleware OK", async () => {
            const next = () => {}

            errorMiddleware(null, null, next)
        })

        it("errorMiddleware ERROR", async () => {
            const res = {
                status: (status) => {
                    return {send: (text) =>{
                        console.log(text)
                    }}
                }
            }

            const next = () => {
                throw Error
            }

            const req = {
                originalUrl: "URL",
                body: { bodytext: "Text"}
            }

            errorMiddleware(req, res, next)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}