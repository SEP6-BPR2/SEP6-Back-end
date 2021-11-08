# SEP6-Back-end
Backend application for SEP6

# Setup
To use this you need to have ".env" and "./terraform/GCPAccount.json" files defined. GCPAccount is a cloud service account used for terraform.

File ".env" contents:<br/>
  GCPDBHOST=0<br/>
  GCPDBPORT=0<br/>
  GCPDBPASSWORD=0<br/>
  GCPDBUSER=0<br/>

File "GCPAccount.json" contents:
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
