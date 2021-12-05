const validator = require('express-validator') 

module.exports.validate = async (req, res, next) => {
    const data = validator.oneOf()
    const errors = validator.validationResult(req) 
    console.log(errors.isEmpty())
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() }) 
    }else{
        next()
    }
}