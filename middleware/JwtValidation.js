const firebaseConnection = require("../models/connections/FirebaseAdminConnection")
const auth = firebaseConnection.auth

function validateJWT(req, res, next){
    auth.verifyIdToken(req.headers.authorization).then((decodedToken) => {
        const uid = decodedToken.uid;
        if( uid == req.params.userId){
            next()
        }else{
            res.status(403).send("Unauthorized: User id from the token does not match userId from the passed parameter")
        }
    }).catch((error) => {
        res.status(400).send(error)
    });
}

module.exports = validateJWT;