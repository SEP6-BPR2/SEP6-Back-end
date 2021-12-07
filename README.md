# SEP6-Back-end
Backend application for SEP6

# Setup
To use this you need to have "./.env" environment variables file defined. They are shown bellow. To use terraform file "./terraform/GCPAccount.json" defined. GCPAccount is a cloud service account used for terraform. To use user authorization you need to have a firebase service account defined in file "./admin-service.json" or if you are deploying to google cloud run it will be taken care of automatically by google cloud.

We are using OMDB and TMDB for third party movie access.

File "./.env" contents:<br/>

  GCPDBHOST=0<br/>
  GCPDBPORT=0<br/>
  GCPDBPASSWORD=0<br/>
  GCPDBUSER=0<br/>
  EXTERNAL_MOVIE_DB_KEY=0<br/>
  EXTERNAL_MOVIE_DB_BASE_URL=0<br/>
  EXTERNAL_FALLBACK_MOVIE_DB_KEY=0<br/>
  redis=enabled<br/>
  redis_network=0<br/>
  redis_password=0<br/>
  redis_port=0<br/>
  use_google_credential_file=enabled<br/>
  GOOGLE_APPLICATION_CREDENTIALS=admin-service.json<br/>
  jwtValidation=enabled<br/>


File "./terraform/GCPAccount.json" and "./admin-service.json" contents:
  {<br/>
    "type": "0",<br/>
    "project_id": "0",<br/>
    "private_key_id": "0",<br/>
    "private_key": "0",<br/>
    "client_email": "0",<br/>
    "client_id": "0",<br/>
    "auth_uri": "0",<br/>
    "token_uri": "0",<br/>
    "auth_provider_x509_cert_url": "0",<br/>
    "client_x509_cert_url": "0"<br/>
  }<br/>



- Install node js.
- run "npm install" to install project dependencies.
- run "npm start" to start the application.

# Testing
To run tests defined in test folder run "npm test".
