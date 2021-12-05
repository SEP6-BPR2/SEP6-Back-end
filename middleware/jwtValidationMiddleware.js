const firebaseConnection = require("../models/connections/firebaseAdminConnection")

function validateJWT(req, res, next){
    if(process.env.jwtValidation == "enabled"){
        firebaseConnection.auth().verifyIdToken(req.headers.authorization).then((decodedToken) => {
            const uid = decodedToken.uid 
            if( uid == req.params.userId){
                next()
            }else{
                res.status(403).send("Unauthorized: User id from the token does not match userId from the passed parameter")
            }
        }).catch((error) => {
            console.log("Error in jwt validation: \n" + error)
            res.status(403).send("Invalid token. Check if expired")
        }) 
    }else{
        next()
    }
}

module.exports = validateJWT 