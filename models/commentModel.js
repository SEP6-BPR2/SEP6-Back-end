const mysql = require('./connections/mySQLConnection') 

module.exports.getFirstOrderCommentsForMovie = async (movieId, number, offset) => {
    return mysql.query(
        "SELECT *, IF((SELECT COUNT(*) FROM movieComment as sc WHERE replyCommentId = fc.commentId), true, false) as hasReplies " + 
        "FROM movieComment as fc " +
        "WHERE fc.movieId = ? " +
        "LIMIT ?,? ",
        [movieId, offset, number]
    ) 
}

module.exports.getSecondOrderCommentsForMovie = async (movieId, replyCommentId, number, offset) => {
    return mysql.query(
        "SELECT * " + 
        "FROM movieComment " +
        "WHERE movieId = ? AND replyCommentId = ? " +
        "LIMIT ?,? ",
        [movieId, replyCommentId, offset, number]
    ) 
}

module.exports.postComment = async (userId, movieId, replyCommentId, text) => {
    return mysql.query(
        "INSERT INTO movieComment (movieId, userId, commentText, replyCommentId, commentTime) VALUES (?, ?, ?, ?, NOW())",
        [movieId, userId, text, replyCommentId]
    ) 
}