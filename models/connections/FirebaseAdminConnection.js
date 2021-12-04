const { initializeApp, applicationDefault, defaultAppConfig} = require('firebase-admin/app');
const { getAuth } = require("firebase-admin/auth");
let defaultApp
let auth
if( process.env.jwtValidation == "enabled" && process.env.use_google_credential_file != null && process.env.use_google_credential_file == "true"){
    // run this in terminal your starting server from as first thing
    // $env:GOOGLE_APPLICATION_CREDENTIALS="admin-service.json"

    defaultApp = initializeApp({
        credential: applicationDefault(),
    });
    auth = getAuth(defaultApp);
    console.log("Firebase auth initialized...")

}else if( process.env.jwtValidation == "enabled" ){
    defaultApp = initializeApp();
    auth = getAuth(defaultApp);
    console.log("Firebase auth initialized...")
    
}else{
    defaultApp = null
    auth = null
}


module.exports.auth = auth;