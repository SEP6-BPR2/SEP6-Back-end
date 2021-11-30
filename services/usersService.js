const userModel = require('../models/usersModel');

module.exports.registerUser = async (userId, nickname) => {
    await userModel.insertUser(userId, nickname)
    await userModel.insertFavoriteList(userId)
    const data = await userModel.getUser(userId)
    return data[0];
}

module.exports.getUser = async (userId) => {
    const data = await userModel.getUser(userId)
    return data[0];
}