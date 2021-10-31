<template>
  <div class="movie">
    <div class="card bg-light mb-4">
      <div class="card-header">{{ movie.title }}</div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12">
            <img v-if="movie.poster" class="img-thumbnail mx-auto d-block" :src="movie.poster" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <p class="card-text">{{ movie.plot }}</p>
            <AddReview
              v-if="$store.state.user.id"
              :movieId="movie._id"
              v-on:updateMovieInfo="getMovie"
            />
            <hr />
            <h3>Reviews</h3>
            <div class="list-group">
              <div class="list-group-item list-group-item-action flex-column align-items-start" v-for="review in movie.reviews" :key="review._id">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">Review by {{ review.name }}</h5>
                  <small class="text-muted">{{ getFormattedDate(review.date) }}</small>
                </div>
                <p v-if="!review.editing" class="mb-1">{{ review.review }}</p>
                <p v-if="review.editing" class="mb-1">
                  <input v-model="newReviewMessage" type="text" class="form-control" />
                </p>
                <a v-if="verifyAuthorship(review.user_id)" 
                  v-on:click="editReview(review)"
                  class="btn btn-primary me-3"
                >Edit</a>
                <a v-if="verifyAuthorship(review.user_id)"
                  v-on:click="deleteReview(review._id)"
                  class="btn btn-danger"
                >Delete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment'
import MovieService from '../services/MovieService'
import AddReview from '../components/AddReview.vue'
import ReviewService from '../services/ReviewService'

export default {
  name: 'Movies',
  components: {
    AddReview,
  },
  data() {
    return {
      movie: {
        poster: '',
        title: '',
        rated: '',
        plot: '',
        _id: '',
        reviews: [],
      },
      newReviewMessage: '',
    }
  },
  created() {
    this.getMovie()
  },
  methods: {
    async getMovie() {
      const movieData = await MovieService.getMovie(
        this.$route.params.id
      )
      const modifiedReviews = movieData.reviews.map(
        (v) => ({ ...v, editing: false })
      )
      movieData.reviews = modifiedReviews
      this.movie = movieData
    },
    getFormattedDate(date) {
      return moment(date).format('LL')
    },
    verifyAuthorship(reviewUserId) {
      if (this.$store.state.user.id &&
          this.$store.state.user.id === reviewUserId) {
        return true
      }
      return false
    },
    editReview(review) {
      if (review.editing) {
        review.review = this.newReviewMessage
        this.saveUpdatedReview(review)
        review.editing = false
      } else {
        this.newReviewMessage = review.review
        review.editing = true
      }
    },
    async saveUpdatedReview(newReview) {
      const data = {
        review: newReview.review,
        name: newReview.name,
        user_id: newReview.user_id,
        movie_id: newReview.movie_id,
        review_id: newReview._id,
      }
      console.log(data)
      await ReviewService.updateReview(data)
    },
    async deleteReview(reviewId) {
      const data = {
        user_id: this.$store.state.user.id,
        review_id: reviewId,
      }
      await ReviewService.deleteReview(data)
      this.getMovie()
    },
  },
}
</script>