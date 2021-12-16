
async function logging(req, res, next){
    console.log("[" + new Date().toLocaleString() + "] - Called: " + req.method + " " + req.originalUrl )
    next()
}

module.exports = logging 