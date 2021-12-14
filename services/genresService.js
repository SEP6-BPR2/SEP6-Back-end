const genresModel = require('../models/genresModel') 
const moviesModel = require('../models/moviesModel') 

module.exports.getAllGenres = async () => {
    const data = await genresModel.getAllGenres()

    let filtered = data.map(genreObj => genreObj.genreName).filter(genre => genre!=="N/A")
    filtered.push("any")
  
    return {genres: filtered}
}

module.exports.deleteDuplicates = async () => {
    const genreLinks = await genresModel.getDuplicates()

    for(let i = 0;  i< genreLinks.length;  i++){
        await genresModel.deleteDuplicates(genreLinks[i].movieId, genreLinks[i].genreId)
        await moviesModel.insertMovieToGenre(genreLinks[i].movieId, genreLinks[i].genreId)
    }

    const personLinks = await genresModel.getDuplicatesPerson()

    for(let i = 0;  i< personLinks.length;  i++){
        await genresModel.deleteDuplicatesPerson(personLinks[i].movieId, personLinks[i].personId, personLinks[i].roleId)
        await moviesModel.insertMovieToPerson(personLinks[i].movieId, personLinks[i].personId, personLinks[i].roleId)
    }
    
    return "End"
}