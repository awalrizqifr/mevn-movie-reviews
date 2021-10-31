import mongodb from 'mongodb'

export default class ReviewsDAO {
    static reviews

    static ObjectId = mongodb.ObjectId

    static async injectDB(conn) {
        if (ReviewsDAO.reviews) {
            return
        }

        try {
            ReviewsDAO.reviews = await conn.db(process.env.MOVIE_REVIEWS_NS).collection('reviews')
        } catch (err) {
            console.error(`Unable to establish connection handle in reviewDAO: ${err}`)
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date,
                review,
                movie_id: ReviewsDAO.ObjectId(movieId)
            }
            return await ReviewsDAO.reviews.insertOne(reviewDoc)
        } catch (err) {
            console.error(`Unable to post review: ${err}`)
            return {error: err}
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await ReviewsDAO.reviews.updateOne(
                {user_id: userId, _id: ReviewsDAO.ObjectId(reviewId)},
                {$set: {review, date}}
            )
            return updateResponse
        } catch (err) {
        console.error(`Unable to update review: ${err}`)
            return {error: err}
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await ReviewsDAO.reviews.deleteOne({
                _id: ReviewsDAO.ObjectId(reviewId),
                user_id: userId
            })
            return deleteResponse
        } catch (err) {
            console.error(`Unable to delete review: ${err}`)
            return {error: err};
        }
    }
}