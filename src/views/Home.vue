<template>
  <div class="home">
    <img src="@/assets/heron_large.png" width=256>
    <form @submit="search">
      <input type="text" placeholder="Search for cards..." v-model="searchText" id="search-field">
    </form>
    <i class="nav-hint">or press Enter to see all cards</i>
    <router-link to="/deckbuilder">Deckbuilder</router-link>
    <p class="version">Innistrad Exhumed 4.6</p>
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
    keyPressed(e) {
      if (e.keyCode === 13) {
        this.$router.push(`/search?q=${this.searchText}`);
      }
    },
  },
  created() {
    window.addEventListener('keypress', this.keyPressed);
  },
  destroyed() {
    window.removeEventListener('keypress', this.keyPressed);
  },
  components: {
  },
};
</script>

<style scoped>
.home {
  margin: 0 auto;
  margin-top: 15vh;
  width: fit-content;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.nav-hint {
  color: #555;
}

#search-field {
  font-size: 18px;
  padding: 10px;
  width: 300px;
  outline: none;
}

form {
  margin-top: 10vh;
}

a {
  color: blue;
  text-decoration: none;
  margin-top: 20px;
}

a:hover {
  text-decoration: underline;
}

.version {
  color: gray;
  position: absolute;
  bottom: 13px;
}
</style>
