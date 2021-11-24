const redis = require('redis');
let client;

if(process.env.redis == "local"){
    client = redis.createClient()
    console.log("Redis connected...")
}else if(process.env.redis == "normal"){
    client = redis.createClient({
        host: 'redis-server',
        port: 6378
    });
    console.log("Redis connected...")
}else{
    client = null;
}

module.exports.client = client;