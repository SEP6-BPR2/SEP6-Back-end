const firebaseConnection = require("../models/connections/firebaseAdminConnection")

function validateJWT(req, res, next){
    if(process.env.jwtValidation == "enabled"){
        if(req.headers.authorization != null){
            firebaseConnection.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
                const uid = decodedToken.uid 
                if( uid == req.params.userId){
                    next()
                }else{
                    res.status(403).send("Unauthorized: User id from the token does not match userId from the passed parameter")
                }
            }).catch((error) => {
                res.status(403).send("Invalid token. Check if expired")
            }) 
        }else{
            res.status(403).send("Invalid token. Token undefined")
        }
    }else{
        next()
    }
}

module.exports = validateJWT 