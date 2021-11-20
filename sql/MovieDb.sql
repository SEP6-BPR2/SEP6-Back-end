CREATE TABLE movies (
	id				INTEGER NOT NULL,
	title			TEXT NOT NULL,
	year			NUMERIC NOT NULL,
	description		TEXT,
	runtime 		TEXT,
	posterURL 		TEXT,
	imdbRating 	    TEXT,
	imdbVotes		TEXT,
	lastUpdated		DATETIME ,
);

update movies set posterURL = NULL where posterURL is not NULL

CREATE TABLE movieToPerson (
	movieId 		INTEGER NOT NULL,
	personId 		INTEGER NOT NULL,
	roleId 			INTEGER NOT NULL
);

CREATE TABLE role (
	roleId 			INTEGER AUTO_INCREMENT NOT NULL,
	roleName 		TEXT NOT NULL,
	PRIMARY KEY(roleId)
);

CREATE TABLE person (
	personId 		INTEGER AUTO_INCREMENT NOT NULL,
	firstName 		TEXT NOT NULL,
	lastName 		TEXT NOT NULL,
	description 	TEXT,
	PRIMARY KEY(personId)
);

CREATE TABLE genre (
	genreId INTEGER AUTO_INCREMENT NOT NULL,
	genreName TEXT NOT NULL,
    PRIMARY KEY(genreId)
);

CREATE TABLE movieToGenre (
	movieId 		INTEGER NOT NULL,
	genreId 		INTEGER NOT NULL,
);
-- search for movie 

SELECT movies.id, movies.title, movies.year, movies.description, movies.runtime, movies.posterURL, imdbRating.imdbRating, imdbRating.imdbVotes, imdbRating.ratingsDate, CONCAT(person.firstName, ' ', person.lastName) as director
FROM movies 
LEFT JOIN imdbRating ON movies.id = imdbRating.movieId
LEFT JOIN movieToPerson ON movies.id = movieToPerson.movieId
LEFT JOIN person ON movieToPerson.personId = person.personId


LIMIT 100;


SELECT movies.id, movies.title, movies.year, movies.description, movies.runtime, movies.posterURL, imdbRating.imdbRating, imdbRating.imdbVotes, imdbRating.ratingsDate, CONCAT(person.firstName, ' ', person.lastName) as director
FROM movies 
LEFT JOIN imdbRating ON movies.id = imdbRating.movieId
LEFT JOIN movieToPerson ON movies.id = movieToPerson.movieId
LEFT JOIN person ON movieToPerson.personId = person.personId
LEFT JOIN 

LIMIT 100;