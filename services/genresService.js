const genresModel = require('../models/genresModel') 

module.exports.getAllGenres = async () => {
    return genresModel.getAllGenres()
}