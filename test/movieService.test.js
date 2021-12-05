require('dotenv').config()
process.env.GCPDBUSER = "testing" // Initialize testing env
const moviesModel = require('../models/moviesModel') 
const moviesService = require('../services/moviesService') 
const favoritesService = require('../services/favoritesService') 
const sinon = require('sinon')

describe("Movie service testing", () => {

    afterEach(function () {
        sinon.restore() 
    }) 

    describe("getListOfMovies", () => {
        it("getListOfMovies OK", async () => {
            sinon.stub(moviesService, "getMovies").returns("Test works") 
            
            const data = await moviesService.getListOfMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data, "Test works")
        })
    })

    describe("getMovies", () => {
        it("getMovies OK no missing details", async () => {
            sinon.stub(moviesModel, "getAllMoviesWithSorting").returns([{poster: "poster", description: "description"}]) 
            
            const data = await moviesService.getMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data[0].poster, "poster")
            assertEquals(data[0].description, "description")
        })

        it("getMovies OK missing poster", async () => {
            sinon.stub(moviesModel, "getAllMoviesWithSorting").returns([{poster: null, description: "description"}]) 
            sinon.stub(moviesService, "getMoreDataForMovieFromThirdParty").returns({poster: "newPoster", description: "description"}) 
            sinon.stub(moviesService, "updateDatabaseMovie")
            
            const data = await moviesService.getMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data[0].poster, "newPoster")
            assertEquals(data[0].description, "description")
        })

        it("getMovies OK missing description", async () => {
            sinon.stub(moviesModel, "getAllMoviesWithSorting").returns([{poster: "poster", description: null}]) 
            sinon.stub(moviesService, "getMoreDataForMovieFromThirdParty").returns({poster: "poster", description: "newDescription"}) 
            sinon.stub(moviesService, "updateDatabaseMovie")
            
            const data = await moviesService.getMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data[0].poster, "poster")
            assertEquals(data[0].description, "newDescription")
        })

        it("getMovies OK missing poster, no poster from third party, OK fallback", async () => {
            sinon.stub(moviesModel, "getAllMoviesWithSorting").returns([{poster: null, description: "description"}]) 
            sinon.stub(moviesService, "getMoreDataForMovieFromThirdParty").returns({poster: "N/A", description: "description"}) 
            sinon.stub(moviesService, "getPosterFromFallbackThirdParty").returns("newPoster")
            sinon.stub(moviesService, "updateDatabaseMovie")
            
            const data = await moviesService.getMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data[0].poster, "https://image.tmdb.org/t/p/w500" + "newPoster")
            assertEquals(data[0].description, "description")
        })

        it("getMovies OK missing poster, no poster from third party, null fallback", async () => {
            sinon.stub(moviesModel, "getAllMoviesWithSorting").returns([{poster: null, description: "description"}]) 
            sinon.stub(moviesService, "getMoreDataForMovieFromThirdParty").returns({poster: "N/A", description: "description"}) 
            sinon.stub(moviesService, "getPosterFromFallbackThirdParty").returns(null)
            sinon.stub(moviesService, "updateDatabaseMovie")
            
            const data = await moviesService.getMovies("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data[0].poster, "N/A")
            assertEquals(data[0].description, "description")
        })
    })

    describe("getMoreDataForMovieFromThirdParty", () => {
        it("getMoreDataForMovieFromThirdParty OK", async () => {
            sinon.stub(moviesService, "convertIdForAPI").returns("movieId") 
            sinon.stub(moviesModel, "getMovieByIDThirdParty").returns(
                {text: () => { 
                    return JSON.stringify(
                        {
                            Plot: "plot",
                            Poster: "poster",
                            Genre: "genre, genre1",
                            Director: "director, director1",
                            Actors: "actor, actor1",
                            imdbRating: "imdbRating",
                            imdbVotes: "imdbVotes",
                            Runtime: "runtime",
                        }
                    )
                }}
            ) 

            const data = await moviesService.getMoreDataForMovieFromThirdParty(123) 
            
            assertEquals(data.description, "plot")
            assertEquals(data.poster, "poster")
            assertEquals(data.genres[0], "genre")
            assertEquals(data.directors[0], "director")
            assertEquals(data.actors[0], "actor")
            assertEquals(data.imdbRating, "imdbRating")
            assertEquals(data.imdbVotes, "imdbVotes")
            assertEquals(data.runtime, "runtime")
        })
    })
    
    describe("getPosterFromFallbackThirdParty", () => {
        it("getPosterFromFallbackThirdParty OK", async () => {
            sinon.stub(moviesService, "convertIdForAPI").returns("movieId") 
            sinon.stub(moviesModel, "getMovieByIDFallbackThirdParty").returns(
                {text: () => { 
                    return JSON.stringify(
                        {
                            poster_path: "posterPath"
                        }
                    )
                }}
            ) 

            const data = await moviesService.getPosterFromFallbackThirdParty(123) 
            
            assertEquals(data, "posterPath")
        })
    })

    describe("convertIdForAPI", () => {
        it("convertIdForAPI OK string id low range", async () => {
            const data = await moviesService.convertIdForAPI("0") 
            
            assertEquals(data, "tt0000000")
        })

        it("convertIdForAPI OK int id high range", async () => {
            const data = await moviesService.convertIdForAPI(9999999) 
            
            assertEquals(data, "tt9999999")
        })

        it("convertIdForAPI OK int id average", async () => {
            const data = await moviesService.convertIdForAPI(12546) 
            
            assertEquals(data, "tt0012546")
        })

        it("convertIdForAPI ERROR too short id", async () => {
            try{
                await moviesService.convertIdForAPI("") 
            }catch{}
        })

        it("convertIdForAPI ERROR too long id", async () => {
            try{
                await moviesService.convertIdForAPI("ssssssssssssssssssssssssssssssssssss") 
            }catch{}
        })
    })

    describe("updateDatabaseMovie", () => {
        it("updateDatabaseMovie OK insert, relate -genre, actor, director non-existent", async () => {
            // sinon.stub(moviesModel, "getGenreByName").returns(["movieId"]) 
            sinon.stub(moviesModel, "getGenreByName").returns([]) 
            sinon.stub(moviesModel, "insertGenre").returns({insertId: "genreId"}) 
            sinon.stub(moviesModel, "insertMovieToGenre")

            // sinon.stub(moviesModel, "getPersonByName").returns(["personId"]) 
            sinon.stub(moviesModel, "getPersonByName").returns([]) 
            sinon.stub(moviesModel, "insertPerson").returns({insertId: "genreId"}) 
            sinon.stub(moviesModel, "insertMovieToPerson")

            sinon.stub(moviesModel, "updateMovie").returns("movieId") 


            await moviesService.updateDatabaseMovie(
                {
                    genres: ["genre"],
                    actors: ["actor lastName"],
                    directors: ["director lastName"]
                }
            ) 

            //Check function calls
        })

        it("updateDatabaseMovie OK insert, relate -genre, actor, director exists", async () => {
            sinon.stub(moviesModel, "getGenreByName").returns([{genreId: "movieId"}]) 
            sinon.stub(moviesModel, "insertMovieToGenre")

            sinon.stub(moviesModel, "getPersonByName").returns([{personId: "personId"}]) 
            sinon.stub(moviesModel, "insertMovieToPerson")

            sinon.stub(moviesModel, "updateMovie").returns("movieId") 


            await moviesService.updateDatabaseMovie(
                {
                    genres: ["genre"],
                    actors: ["actor"],
                    directors: ["director"]
                }
            ) 

            //Check function calls
        })
    })

    describe("getMovieDetailsAndFavorites", () => {
        it("getMovieDetailsAndFavorites OK with favorites", async () => {
            sinon.stub(moviesService, "getMovieDetails").returns({movies: ["movie"]}) 
            sinon.stub(favoritesService, "isMovieInUserFavorites").returns({exists: "true"}) 

            const data = await moviesService.getMovieDetailsAndFavorites("movieId", 1, "userId") 
            
            assertEquals(data.movies[0], "movie")
            assertEquals(data.favorites, "true")
        })

        it("getMovieDetailsAndFavorites OK without favorites", async () => {
            sinon.stub(moviesService, "getMovieDetails").returns({movies: ["movie"]}) 

            const data = await moviesService.getMovieDetailsAndFavorites("movieId", 0, "userId") 
            
            assertEquals(data.movies[0], "movie")
            assertTrue(!data.hasOwnProperty("favorites"))
        })

        it("getMovieDetailsAndFavorites ERROR", async () => {
            sinon.stub(moviesService, "getMovieDetails").returns({error: "Error details"}) 

            const data = await moviesService.getMovieDetailsAndFavorites("movieId", 1, "userId") 
            
            assertEquals(data.error, "Error details")
            assertTrue(!data.hasOwnProperty("favorites"))
        })
    })

    describe("getMovieDetails", () => {
        it("getMovieDetails OK no posterURL", async () => {
            sinon.stub(moviesModel, "getMovieByMovieId").returns([{id: "movieId"}]) 
            sinon.stub(moviesService, "getMoreDataForMovieFromThirdParty").returns({description: "description"}) 
            sinon.stub(moviesService, "updateDatabaseMovie")

            const data = await moviesService.getMovieDetails("movieId") 
            
            assertEquals(data.id, "movieId")
            assertEquals(data.description, "description")
        })

        it("getMovieDetails OK", async () => {
            sinon.stub(moviesModel, "getMovieByMovieId").returns([{id: "movieId", posterURL: "poster"}]) 
            sinon.stub(moviesModel, "getPeopleByMovieId").returns([{roleName: "Director", name: "director"}, {roleName: "Actor", name: "actor"}]) 
            sinon.stub(moviesModel, "getGenresByMovieId").returns([{genreName: "genreName"}]) 

            const data = await moviesService.getMovieDetails("movieId") 
            
            assertEquals(data.id, "movieId")
            assertEquals(data.posterURL, "poster")
            assertEquals(data.actors[0], "actor")
            assertEquals(data.directors[0], "director")
            assertEquals(data.genres[0], "genreName")
        })

        it("getMovieDetails ERROR movie not found", async () => {
            sinon.stub(moviesModel, "getMovieByMovieId").returns([]) 

            const data = await moviesService.getMovieDetails("movieId") 
            
            assertEquals(data.error, "Movie not found")
        })
    }) 

    describe("getBySearch", () => {
        it("getBySearch OK", async () => {
            sinon.stub(moviesService, "getMovies").returns("Test works") 

            const data = await moviesService.getBySearch("sorting", 123, 1, "category", 1, "search") 
            
            assertEquals(data, "Test works")
        })
    })

    describe("getSortingMethods", () => {
        it("getSortingMethods OK", async () => {
            sinon.stub(moviesModel, "getSortingMethods").returns("Test works") 

            const data = await moviesService.getSortingMethods() 
            
            assertEquals(data, "Test works")
        })
    })

    describe("update", () => {
        it("update OK", async () => {
            sinon.stub(moviesModel, "getMoviesWithNoPoster").returns([{id: "movieId", posterURL: "N/A"}]) 
            sinon.stub(moviesService, "getPosterFromFallbackThirdParty").returns("poster") 
            sinon.stub(moviesModel, "updateMovie")

            const data = await moviesService.update() 
            
            assertEquals(data, 200)
        })

        it("update null", async () => {
            sinon.stub(moviesModel, "getMoviesWithNoPoster").returns([{id: "movieId", posterURL: "N/A"}]) 
            sinon.stub(moviesService, "getPosterFromFallbackThirdParty").returns(null) 
            sinon.stub(moviesModel, "updateMovie")

            const data = await moviesService.update() 
            
            assertEquals(data, 200)
        })
    })
})

function assertEquals(value1, value2){
    if(value1 != value2) throw error
}

function assertTrue(value){
    if(!value) throw error
}