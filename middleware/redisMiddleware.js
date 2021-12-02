const redisClient = require("../models/connections/RedisConnection");

module.exports.redisGet = async (req, res, next) => {
    let url = req.originalUrl
    // if(req.originalUrl.split('/')[2] == "search"){
    //     url = url + "/" + req.body.movieName
    // }
    
    redisClient.client.get(url, (error, data) =>{
        if(error) throw err

        if(data != null){
            res.send(data)
        }else{
            next();
        }
    });
}

module.exports.redisSet = async (key, value) => {
    if(process.env.redis && value != null){
        redisClient.client.setex(key, 3600, JSON.stringify(value));
    }
}

