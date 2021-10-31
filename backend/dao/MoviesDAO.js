import mongodb from 'mongodb'

export default class MoviesDAO {
    static movies

    static ObjectId = mongodb.ObjectId

    static async injectDB(conn) {
        if (MoviesDAO.movies) {
            return
        }

        try {
            MoviesDAO.movies = await conn.db(process.env.MOVIE_REVIEWS_NS)
                .collection('movies')
        } catch (err) {
           console.log(`Unable to connect in MoviesDAO: ${e}`) 
        }
    }

    static async getMovieById(id) {
        try {
            return await MoviesDAO.movies.aggregate([
                {
                    $match: {
                        _id: new MoviesDAO.ObjectId(id)
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    },
                }
            ]).next()
        } catch (err) {
            console.error(`Something went wrong in getMovieById: ${err}`)
            throw err
        }
    }

    static async getMovies({ // Default Filter
        filters = null,
        page = 0,
        moviesPerPage = 20 // Will only get 20 movies at once
    } = {}) {
        let query
        if (filters) {
            if ('title' in filters) {
                query = {$text: {$search: filters.title}}
            } else if ('rated' in filters) {
                query = {rated: {$eq: filters.rated}}
            }
        }

        let cursor
        try {
            cursor = await MoviesDAO.movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await MoviesDAO.movies.countDocuments(query)
            return {moviesList, totalNumMovies}
            } catch (err) {
            console.error(`Unable to issue find command, ${err}`)
            return {moviesList: [], totalNumMovies: 0}
        }
    }

    static async getRatings() {
        let ratings = []
        try {
            ratings = await MoviesDAO.movies.distinct('rated')
            return ratings
        } catch (err) {
            console.error(`Unable to get ratings, ${err}`)
            return ratings
        }
    }
}