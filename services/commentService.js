const commentModel = require('../models/commentModel') 

module.exports.getComments = async (movieId, number, offset) => {
    return commentModel.getCommentsForMovie(movieId, number, offset) 
}

module.exports.postComment = async (userId, movieId, commentBody) => {
    return commentModel.postComment(userId, movieId, commentBody.replyCommentId, commentBody.text) 
}