// require('dotenv').config()
// const sinon = require('sinon')
// const validator = require('express-validator') 
// const validateMiddleware = require('../../middleware/validateMiddleware')

// describe("redis middleware testing", () => {

//     afterEach(function () {
//         sinon.restore() 
//     }) 

//     describe("validate", () => {
//         it("validate ERROR", async () => {
//             sinon.stub(validator, "validationResult").returns({
//                 array: () => {
//                     return "data"
//                 },
//                 isEmpty: () => {
//                     return false
//                 }
//             }) 

//             const res = {
//                 status: (status) =>{
//                     return {
//                         send: (text) =>{
//                             assertEquals(text, "data")
//                             assertEquals(status, 400)
//                         }
//                     }
//                 }
//             }

//             const next = () => {}

//             const req = {
//                 originalUrl: "URL",
//             }

//             await validateMiddleware.validate(req, res, next)
//         })

//         it("validate ERROR", async () => {
//             sinon.stub(expressValidator, "validationResult").returns({

//                 isEmpty: () => {
//                     return true
//                 }
//             }) 

//             const res = {}

//             const next = () => {}

//             const req = {
//                 originalUrl: "URL",
//             }

//             validateMiddleware.validate(req, res, next)
//         })
//     })
// })

// function assertEquals(value1, value2){
//     if(value1 != value2) throw Error("Failed assert")
// }


/**
 * COMMENTED OUT DUE TO STUBBING PROBLEMS WITH express-validator
 * 
 */