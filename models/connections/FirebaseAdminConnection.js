const { initializeApp, applicationDefault, defaultAppConfig} = require('firebase-admin/app');
const { getAuth } = require("firebase-admin/auth");
let defaultApp

if(process.env.use_google_credential_file != null && process.env.use_google_credential_file == "true"){
    // run this in terminal your starting server from as first thing
    // $env:GOOGLE_APPLICATION_CREDENTIALS="admin-service.json"

    defaultApp = initializeApp({
        credential: applicationDefault(),
    });
    
}else{
    defaultApp = initializeApp();
}
const auth = getAuth(defaultApp);

console.log("Firebase auth initialized...")

module.exports.auth = auth;