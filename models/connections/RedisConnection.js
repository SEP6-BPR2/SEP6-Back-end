const redis = require('redis');
let client;

if(process.env.local){
    client = redis.createClient()
}else{
    client = redis.createClient({
        host: 'redis-server',
        port: 6378
    });
}
console.log("Redis connected...")

module.exports.client = client;