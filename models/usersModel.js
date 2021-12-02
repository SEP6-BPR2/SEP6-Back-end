const mysql = require('./connections/MySQLConnection');

module.exports.insertUser = async (id, nickname) => {
    return await mysql.query(
        "INSERT INTO appUser (userId, nickname) VALUES (?, ?) ",
        [id, nickname]
    );
}

module.exports.updateUser = async (id, nickname) => {
    return await mysql.query(
        "UPDATE appUser " +
        "SET appUser.nickname = ? " +
        "WHERE appUser.userId = ?  ",
        [nickname, id]
    );
}

module.exports.insertFavoriteList = async (userId) => {
    return await mysql.query(
        "INSERT INTO favoritesList (userId) VALUES (?) ",
        [userId]
    );
}

module.exports.getUser = async (userId) => {
    return await mysql.query(
        "SELECT * FROM appUser WHERE appUser.userId = ?",
        [userId]
    );
}