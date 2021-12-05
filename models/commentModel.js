const mysql = require('./connections/mySQLConnection') 

module.exports.getCommentsForMovie = async (movieId) => {
    return mysql.query(
        "SELECT * FROM movieComment " +
        "WHERE movieComment.movieId = ?",
        [movieId]
    ) 
}

module.exports.postComment = async (userId, movieId, replyCommentId, text) => {
    return mysql.query(
        "INSERT INTO movieComment (movieId, userId, commentText, replyCommentId, commentTime) VALUES (?, ?, ?, ?, NOW())",
        [movieId, userId, text, replyCommentId]
    ) 
}