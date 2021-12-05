const genresModel = require('../models/genresModel');

module.exports.getAllGenres = async () => {
    const data = await genresModel.getAllGenres()
    let filtered = data.map(genreObj => genreObj.genreName).filter(genre => genre!=="N/A")
    filtered.push("any")
    return {genres: filtered}
}