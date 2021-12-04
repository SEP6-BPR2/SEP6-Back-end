function errorMiddleware(req, res, next){
    try{
        next()
    }catch{
        console.log(
            "ERROR DETECTED IN BACKEND: " +
            "\nURL: " + req.originalUrl +
            "\nBODY: \n" + req.body +
            error
        );
        res.status(500).send("Error occurred in backend")
    }
}

module.exports = errorMiddleware 