CREATE TABLE movies (
	id				INTEGER NOT NULL,
	title			TEXT NOT NULL,
	year			NUMERIC NOT NULL,
	description		TEXT,
	runtime 		TEXT,
	posterURL 		TEXT,
	rating 	    	TEXT,
	votes			TEXT,
	lastUpdated		DATETIME 
) 

update movies set posterURL = NULL where posterURL is not NULL

CREATE TABLE movieToPerson (
	movieId 		INTEGER NOT NULL,
	personId 		INTEGER NOT NULL,
	roleId 			INTEGER NOT NULL
) 

CREATE TABLE role (
	roleId 			INTEGER AUTO_INCREMENT NOT NULL,
	roleName 		TEXT NOT NULL,
	PRIMARY KEY(roleId)
) 

CREATE TABLE person (
	personId 		INTEGER AUTO_INCREMENT NOT NULL,
	firstName 		TEXT NOT NULL,
	lastName 		TEXT NOT NULL,
	description 	TEXT,
	PRIMARY KEY(personId)
) 

CREATE TABLE genre (
	genreId INTEGER AUTO_INCREMENT NOT NULL,
	genreName TEXT NOT NULL,
    PRIMARY KEY(genreId)
) 

CREATE TABLE movieToGenre (
	movieId 		INTEGER NOT NULL,
	genreId 		INTEGER NOT NULL
) 

CREATE TABLE appUser (
	userId 			TEXT NOT NULL,
	nickname 		TEXT NOT NULL,
) 

CREATE TABLE favoritesList (
	favoritesId 	INTEGER AUTO_INCREMENT NOT NULL,
	userId 			TEXT NOT NULL,
    PRIMARY KEY(favoritesId)
) 

CREATE TABLE favoritesListToMovie (
	favoritesId 	INTEGER NOT NULL,
	movieId 		INTEGER NOT NULL
) 

CREATE TABLE favoritesListToMovie (
	favoritesId 	INTEGER NOT NULL,
	movieId 		INTEGER NOT NULL
) 

CREATE TABLE movieComment (
	commentId		INTEGER AUTO_INCREMENT NOT NULL,
	movieId 		INTEGER NOT NULL,
	userId 			TEXT NOT NULL,
	commentText 	TEXT NOT NULL,
	replyCommentId 	INTEGER,
	commentTime		DATETIME NOT NULL,
    PRIMARY KEY(commentId)
) 