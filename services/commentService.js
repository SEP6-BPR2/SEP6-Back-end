const commentModel = require('../models/commentModel') 

module.exports. getCommentsFirstOrder = async (movieId, number, offset) => {
    return commentModel.getFirstOrderCommentsForMovie(movieId, number, offset) 
}

module.exports. getCommentsSecondOrder = async (movieId, commentId, number, offset) => {
    return commentModel.getSecondOrderCommentsForMovie(movieId, commentId, number, offset) 
}

module.exports.postComment = async (userId, movieId, commentBody) => {
    return commentModel.postComment(userId, movieId, commentBody.replyCommentId, commentBody.text) 
}