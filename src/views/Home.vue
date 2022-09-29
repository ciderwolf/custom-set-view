<template>
  <div class="home">
    <img src="@/assets/heron_large.png" width=256>
    <form @submit="search">
      <input type="text" placeholder="Search for cards..." v-model="searchText" id="search-field">
    </form>
    <i class="nav-hint">or press Enter to see all cards</i>
    <div class="navigation">
      <router-link to="/deckbuilder">Deckbuilder</router-link>
      <a href="https://discord.gg/RyhCxGeyKR" id="discord-link" target="_blank">
        <img src='@/assets/discord-logo.svg'>Join our Discord
      </a>
    </div>
    <p class="version">Innistrad Exhumed 4.9</p>
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

#discord-link {
  display: flex;
  align-items: center;
}

#discord-link img {
  height: 16px;
  margin-right: 4px;
}

.navigation {
  display: flex;
  width: 300px;
  margin-top: 20px;
  justify-content: space-around;
}

.navigation a {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  height: 28px;
  font-size: 14px;
  font-weight: 500;
  color: #484848;
  text-decoration: none;
  border: 1px solid rgba(41, 41, 41, 0.5);
  border-radius: 3px;
  background-color: #f8f8f8;
  transition: border-color, background-color 0.3s linear;
}

.navigation a:hover {
  background-color: white;
  border-color: rgba(41, 41, 41, 0.75);
}

.version {
  color: gray;
  position: absolute;
  bottom: 13px;
}
</style>
