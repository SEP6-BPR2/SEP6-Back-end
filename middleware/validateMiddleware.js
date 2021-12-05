const validator = require('express-validator') 

module.exports.validate = async (req, res, next) => {
    const errors = validator.validationResult(req) 
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() }) 
    }else{
        next()
    }
}