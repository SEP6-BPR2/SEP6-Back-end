# SEP6-Back-end
Backend application for SEP6

# Setup
To use this you need to have ".env" and "./terraform/GCPAccount.json" files defined. GCPAccount is a cloud service account used for terraform.

File ".env" contents:
  GCPDBHOST=0
  GCPDBPORT=0
  GCPDBPASSWORD=0
  GCPDBUSER=0

File "GCPAccount.json" contents:
  {
    "type": "0",
    "project_id": "0",
    "private_key_id": "0",
    "private_key": "0",
    "client_email": "0",
    "client_id": "0",
    "auth_uri": "0",
    "token_uri": "0",
    "auth_provider_x509_cert_url": "0",
    "client_x509_cert_url": "0"
  }

- Install node js.
- run "npm install" to install project dependencies.
- run "npm start" to start the application.

# Testing
To run tests defined in test folder run "npm test".
