const mysql = require('mysql');

let connection;
if(process.env.GCPDBUSER !== "testing"){
    connection = mysql.createConnection({
        host     : process.env.GCPDBHOST,
        user     : process.env.GCPDBUSER,
        password : process.env.GCPDBPASSWORD,
        database : process.env.GCPDBDATABASE
    });
    
    connection.connect((err) => {
        if(err){
            throw err;
        }
        console.log("MySql Connected...")
    });
}else{
    connection = null;
}
 
module.exports.connection = connection;


//Uses prepared statements by replacing the ? in the queryString with values, in order.
//queryString = 'SELECT * FROM `books` WHERE `author` = ?', 
//values = ['David']
//IMPORTANT - for values to be integers in query string after combining, they have to be actual integers. 
//If they are string numbers they will have qoutes on them.
module.exports.query = async (queryString, values) => {
    return new Promise((resolve, reject) => {
        connection.query(queryString, values, function (error, elements) {
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};