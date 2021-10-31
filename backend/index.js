import express from 'express'
import cors from 'cors'
import MoviesRoute from './api/MoviesRoute.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import MoviesDAO from './dao/MoviesDAO.js'
import ReviewsDAO from './dao/ReviewsDAO.js'

class Index {
    static app = express()

    static router = express.Router()

    static main() {
        dotenv.config()
        Index.setUpServer()
        Index.setUpDatabase()
    }

    static setUpServer() {
        Index.app.use(cors())
        Index.app.use(express.json())

        Index.app.use('/api/v1/movies', MoviesRoute.configRoutes(Index.router))
        Index.app.use('*', (req, res) => {
            res.status(404).json({error: 'Not Found'})
        })
    }

    static async setUpDatabase() {
        const client = new mongodb.MongoClient(process.env.MOVIE_REVIEWS_DB_URI)
        const port = process.env.PORT || 8000

        try {
            // Connect to the MongoDB cluster
            await client.connect()
            await MoviesDAO.injectDB(client)
            await ReviewsDAO.injectDB(client)
            Index.app.listen(port, () => {
                console.log(`Server is running on port:${port}`)
            })
        } catch (err) {
            console.log(err)
            process.exit(1)
        }
    }
}

Index.main()