const mysql = require('./connections/MySQLConnection');

module.exports.getExampleData = async () => {
    const data = await mysql.query("SELECT 1 + 1 AS solution");
    return data;
}
 

 
