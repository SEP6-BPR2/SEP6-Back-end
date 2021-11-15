const mysql = require('./connections/MySQLConnection');

module.exports.getExampleData = async () => {
    try{
        const data = await mysql.query("SELECT 1 + 1 AS solution");
        return data;
    }catch{
        return [];
    }
}