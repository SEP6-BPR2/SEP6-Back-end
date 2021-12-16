const redisClient = require("../models/connections/redisConnection") 

module.exports.redisGet = async (req, res, next) => {
    let url = req.originalUrl

    if(process.env.redis == "local" || process.env.redis == "normal"){
        redisClient.client().get(url, (error, data) =>{
            if(error) next() //If there is error just continue without redis
    
            if(data != null){
                res.send(data)
            }else{
                next() 
            }
        }) 
    }else{
        next()
    }
}

module.exports.redisSet = async (key, value) => {
    if(process.env.redis == "local" || process.env.redis == "normal" ){
        if(value != null){
            redisClient.client().setex(key, 3600, JSON.stringify(value)) 
        }
    }
}