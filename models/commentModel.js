const mysql = require('./connections/mySQLConnection') 

module.exports.getCommentsForMovie = async (movieId, number, offset) => {
    return mysql.query(
        "SELECT * FROM movieComment " +
        "WHERE movieComment.movieId = ?" +
        "LMIT ?,?",
        [movieId, offset, number]
    ) 
}

module.exports.postComment = async (userId, movieId, replyCommentId, text) => {
    return mysql.query(
        "INSERT INTO movieComment (movieId, userId, commentText, replyCommentId, commentTime) VALUES (?, ?, ?, ?, NOW())",
        [movieId, userId, text, replyCommentId]
    ) 
}