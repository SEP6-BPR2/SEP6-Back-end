const userModel = require('../models/usersModel');

module.exports.registerUser = async (userId, nickname) => {
    //Check if user already exists 
    const user = await userModel.getUser(userId)

    if(user.length == 1){
        await userModel.updateUser(userId, nickname)
    }else if (user.length == 0){
        await userModel.insertUser(userId, nickname)
        await userModel.insertFavoriteList(userId)
    }
    
    const data = await userModel.getUser(userId)
    return data[0];
}

module.exports.getUser = async (userId) => {
    const data = await userModel.getUser(userId)
    return data[0];
}