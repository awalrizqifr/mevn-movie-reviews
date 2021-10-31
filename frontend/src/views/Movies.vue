<template>
  <!-- form control -->
  <div class="row mb-3">
    <div class="col">
      <div class="d-flex">
        <input v-model="titleToSearch" class="form-control" placeholder="Search by title" />
          <a v-on:click="filterMovies('title')" class="btn btn-secondary ms-3">
            Search
          </a>
      </div>
    </div>
    <div class="col">
      <div class="d-flex">
        <select v-model="ratingToSearch" class="form-select">
          <option disabled selected value="">Select by Rating</option>
          <option v-for="rating in ratings" :key="rating" :value="rating">
            {{ rating }}
          </option>
        </select>
        <a v-on:click="filterMovies('rated')" class="btn btn-secondary ms-3">
          Filter
        </a>
        </div>
    </div>
  </div>
  <!-- form control -->

  <div class="row">
    <div v-for="movie in movies" :key="movie._id" class="col-lg-3 col-md-4">
      <div class="card bg-light my-1">
        <img v-if="movie.poster" class="card-img-top" :src="movie.poster" />
        <div class="card-body">
          <h4 class="card-title">{{ movie.title }}</h4>
          <p v-if="movie.rated" class="card-text">
            <span>Rating: {{ movie.rated }}</span>
          </p>
          <p class="card-text">{{ movie.plot }}</p>
          <router-link :to="'/movie/'+movie._id" class="btn btn-secondary">
            View Reviews
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <nav>
    <ul class="pagination ms-3 justify-content-center">
      <li class="page-item">
        <a class="page-link" v-on:click="getPrevPage()" role="button">
          Get previous {{ entriesPerPage }}
        </a>
      </li>
      <li class="page-item disabled">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
          Showing Page: {{ currentPage }}
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" v-on:click="getNextPage()" role="button">
        Get next {{ entriesPerPage }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import MovieService from '../services/MovieService'

export default {
  name: 'Movies',
  data() {
    return {
      movies: [],
      ratings: [],
      titleToSearch: '',
      ratingToSearch: '',
      typeToSearch: '',
      currentPage: 0,
      entriesPerPage: 20,
      totalPages: 0,
    }
  },
  created() {
    this.getMovies();
    this.getRatings();
  },
  methods: {
    async getMovies() {
      let query = ''
      if (this.typeToSearch === 'title') {
        query = this.titleToSearch
      } else if (this.typeToSearch === 'rated') {
        query = this.ratingToSearch
      }
      const moviesData = await MovieService.getMovies(
        query, this.typeToSearch, this.currentPage
      )
      this.totalPages = Math.ceil(
        moviesData.total_results / this.entriesPerPage
      ) - 1
      this.movies = moviesData.movies
    },
    async getRatings() {
      this.ratings = await MovieService.getRatings()
    },
    async filterMovies(type) {
      this.typeToSearch = type
      this.currentPage = 0
      this.getMovies()
    },
    async getNextPage() {
      this.currentPage += 1
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
      this.getMovies()
    },
    async getPrevPage() {
      this.currentPage -= 1
      if (this.currentPage < 0) {
        this.currentPage = 0;
      }
      this.getMovies()
    },
  },
}
</script>