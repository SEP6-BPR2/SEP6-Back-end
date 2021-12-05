const commentModel = require('../models/commentModel') 

module.exports.getComments = async (movieId) => {
    return commentModel.getCommentsForMovie(movieId) 
}

module.exports.postComment = async (userId, movieId, commentBody) => {
    return commentModel.postComment(userId, movieId, commentBody.replyCommentId, commentBody.text) 
}