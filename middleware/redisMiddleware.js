const redisClient = require("../models/connections/RedisConnection");

module.exports.redisGet = async (req, res, next) => {
    redisClient.client.get(req.originalUrl, (error, data) =>{
        if(error) throw err

        if(data != null){
            res.send(data)
        }else{
            next();
        }
    });
}

module.exports.redisSet = async (key, value) => {
    if(process.env.redis){
        redisClient.client.setex(key, 3600, value);
    }
}

