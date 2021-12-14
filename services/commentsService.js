const commentsModel = require('../models/commentsModel') 

module.exports. getCommentsFirstOrder = async (movieId, number, offset) => {
    return commentsModel.getFirstOrderCommentsForMovie(movieId, number, offset) 
}

module.exports. getCommentsSecondOrder = async (movieId, commentId, number, offset) => {
    return commentsModel.getSecondOrderCommentsForMovie(movieId, commentId, number, offset) 
}

module.exports.postComment = async (userId, movieId, commentBody) => {
    return commentsModel.postComment(userId, movieId, commentBody.replyCommentId, commentBody.text) 
}