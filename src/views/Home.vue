<template>
  <div class="home">
    <img alt="IEX logo" src="../assets/logo.png">
    <form @submit="search">
      <input type="text" placeholder="Search for cards..." v-model="searchText">
    </form>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      searchText: '',
    };
  },
  methods: {
    search(e) {
      this.$router.push(`/search?q=${this.searchText}`);
      e.preventDefault();
    },
  },
  components: {
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: min-content;
  margin: 0 auto;
}

.home input {
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #aaaaaa;
  outline: none;
}
</style>
