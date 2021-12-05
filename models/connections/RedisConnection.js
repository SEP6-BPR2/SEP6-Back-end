const redis = require('redis') 

let client 

if(process.env.redis == "local"){
    client = redis.createClient()
    console.log("Redis Connected...")
}else if(process.env.redis == "normal"){
    client = redis.createClient({
        host: process.env.redis_network,
        port: process.env.redis_port,
        auth_pass: process.env.redis_password
    }) 
    console.log("Redis Connected...")
}else{
    client = null
}

module.exports.client = () => {
    return client
} 