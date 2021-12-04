const redisClient = require("../models/connections/redisConnection") 

module.exports.redisGet = async (req, res, next) => {
    let url = req.originalUrl

    // if(req.originalUrl.split('/')[2] == "search"){
    //     url = url + "/" + req.body.movieName
    // }

    if(process.env.redis == "local" || process.env.redis == "normal"){
        redisClient.client.get(url, (error, data) =>{
            if(error) throw err
    
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
            redisClient.client.setex(key, 3600, JSON.stringify(value)) 
        }
    }
}