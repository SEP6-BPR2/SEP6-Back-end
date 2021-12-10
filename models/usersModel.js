const mysql = require('./connections/mySQLConnection') 

module.exports.insertUser = async (id, nickname, photoURL) => {
    return mysql.query(
        "INSERT INTO appUser (userId, nickname, photoURL) VALUES (?, ?, ?) ",
        [id, nickname, photoURL]
    ) 
}

module.exports.updateUser = async (id, nickname, photoURL) => {
    return mysql.query(
        "UPDATE appUser " +
        "SET appUser.nickname = ? " +
        "WHERE appUser.userId = ? " +
        "appUser.photoURL = ?",
        [nickname, id, photoURL]
    ) 
}

module.exports.insertFavoriteList = async (userId) => {
    return mysql.query(
        "INSERT INTO favoritesList (userId) VALUES (?) ",
        [userId]
    ) 
}

module.exports.getUser = async (userId) => {
    return mysql.query(
        "SELECT * FROM appUser WHERE appUser.userId = ?",
        [userId]
    ) 
}