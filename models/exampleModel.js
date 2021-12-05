const mysql = require('./connections/mySQLConnection') 

module.exports.getExampleData = async () => {
    return mysql.query("SELECT 1 + 1 AS solution")
}