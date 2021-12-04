const genresModel = require('../models/genresModel') 

module.exports.getAllGenres = async () => {
    const data = await genresModel.getAllGenres()
    return data 
}