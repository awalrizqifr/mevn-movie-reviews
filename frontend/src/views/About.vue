<template>
  <div class="about">
    <div class="card text-white bg-secondary mb-3">
      <div class="card-header">{{ title }}</div>
      <div class="card-body">
        <h4 class="card-title">This is an about page</h4>
        <p class="card-text">{{ description }}</p>
        <p class="card-text">{{ team }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      title: 'About us',
      description: 'This is the best movie application in the world!',
      team: 'Developed by YouAreAdmin'
    }
  },
}
</script>
