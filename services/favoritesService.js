const e = require('express');
const favoritesModel = require('../models/favoritesModel');
const usersModel = require('../models/usersModel');

module.exports.getFavoritesList = async (userId) => {
    const user = await usersModel.getUser(userId)
    const list = await favoritesModel.getFavoritesList(userId)
    if(list != null && list.length != 0){
        const movies = await favoritesModel.getFavoritesListMovies(list[0].favoritesId)
        return {
            author: user[0].nickname,
            movies: movies
        }
    }else{
        return {
            author: null,
            movies: null
        }
    }
}

module.exports.addMovieToFavoritesList = async (userId, movieId) => {
    const list = await favoritesModel.getFavoritesList(userId)
    if (list != null && list.length != 0 ){
        
        const relation = await favoritesModel.getFavoritesListToMovie(list[0].favoritesId, movieId);

        if( relation.length == 0 ){
            
            await favoritesModel.addMovieToFavoritesList(list[0].favoritesId, movieId)
            return 200;

        }else{
            return 403
        }
    }else{
        return 403
    }
}

module.exports.removeMovieFromFavoritesList = async (userId, movieId) => {
    const list = await favoritesModel.getFavoritesList(userId)
    if (list != null && list.length != 0 ){
        const relation = await favoritesModel.getFavoritesListToMovie(list[0].favoritesId, movieId);
        if(relation.length == 1 ){
            await favoritesModel.removeMovieFromFavoritesList(list[0].favoritesId, movieId)
            return 200;
        }else{
            return 403
        }
    }else{
        return 403
    }
}

module.exports.isMovieInUserFavorites = async (userId, movieId) => {
    const list = await favoritesModel.getFavoritesList(userId)
    if (list != null && list.length != 0 ){
        const relation = await favoritesModel.getFavoritesListToMovie(list[0].favoritesId, movieId)
        if(relation.length == 1){
            return {
                exists: true
            }
        }else{
            return {
                exists: false
            }
        }
    }else{
        return {
            exists: false
        }
    }
}