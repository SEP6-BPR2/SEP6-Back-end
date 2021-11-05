var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.GCPDBHOST,
    user     : process.env.GCPDBUSER,
    password : process.env.GCPDBPASSWORD,
    database : process.env.GCPDBDATABASE
});
 
module.exports.connection = connection;

module.exports.query = async (queryString) => {
    return new Promise((resolve, reject) => {
        connection.connect();
        connection.query(queryString, function (error, elements) {
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};



