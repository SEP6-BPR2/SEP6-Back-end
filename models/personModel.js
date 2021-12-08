const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)) 


module.exports.searchActorByName = async (name) => {
    return fetch(
        "https://api.themoviedb.org/3/search/person?api_key=" + process.env.EXTERNAL_FALLBACK_MOVIE_DB_KEY + "&query=" + name + "&page=1&include_adult=false"
    )
}

