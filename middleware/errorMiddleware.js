function errorMiddleware(req, res, next){
    try{
        next()
    }catch(error){
        console.log(
            "ERROR DETECTED IN BACKEND: " +
            "\nURL: " + req.originalUrl +
            "\nBODY: \n" + JSON.stringify(req.body) +
            "\n\n" + 
            error
        );
        res.status(500).send("Error occurred in backend")
    }
}

module.exports = errorMiddleware 