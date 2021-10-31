<template>
  <!-- Header -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Movies App</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/">Home</router-link> 
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/movies">Movies</router-link> 
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/about">About</router-link> 
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link v-if="!userData" class="nav-link" active-class="active" to="/login">Login</router-link> 
          </li>
          <a v-if="userData" v-on:click="logout()" role="button">
            Logout ({{ userData }})
          </a>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Header -->
  <div class="container mt-4">
    <router-view/>
  </div>

  <!-- Footer -->
  <footer class="text-white bg-dark text-center p-3">
    <span>&copy; 2021 YouAreAdmin</span>
  </footer>
  <!-- Footer -->
</template>

<script>
export default {
  name: 'App',
  computed: {
    userData() {
      if (this.$store.state.user.id) {
        return `${this.$store.state.user.id} - ${this.$store.state.user.name}`
      }
      return ''
    },
    methods: {
      logout() {
        this.$store.commit('disconnect')
      },
    },
  },
}
</script>
