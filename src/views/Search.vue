<template>
  <div class="search">
    <div id="search-container">
      <router-link to="/">
        <img src="@/assets/heron_small.png" style="padding-right: 15px" />
      </router-link>
      <label for="search-bar">
        <img width="20" height="20" style="margin-top: 4px" src="@/assets/magnifying-glass.png" />
      </label>
      <input type="text" v-model="searchText" @input="searchBarInput"
        placeholder="Search for cards..." id="search-bar">
      <router-link to="advanced">
        <img width="20" height="20" id="advanced-search" style="margin-top: 4px"
          src="@/assets/gear.svg" />
      </router-link>
      <p id="search-error"></p>
    </div>
    <div id="card-img">
      <router-link class="card-container" v-for="card in results" :key="card.name"
        :to="'/search/card?name=' + card.simple_name">
        <Card :card="card"/>
      </router-link>
    </div>
    <h3 id="no-results" v-if="results.length === 0">No search results found</h3>
  </div>
</template>

<script>
import { search, getCards } from '@/search';
import Card from '@/components/Card.vue';

export default {
  data() {
    return {
      hasSearch: false,
      searchText: '',
      cards: [],
      results: [],
    };
  },
  methods: {
    async searchBarInput() {
      this.search();
      if (this.searchText !== '') {
        this.$router.replace(`/search?q=${this.searchText}`);
      } else {
        this.$router.replace('/search');
      }
    },
    search() {
      this.results = search(this.searchText);
    },
  },
  mounted() {
    this.cards = getCards();
    this.searchText = this.$route.query.q || '';
    this.search();
  },
  components: { Card },
  name: 'Search',
};
</script>

<style scoped>
#card-img {
  display: flex;
  flex-flow: row wrap;
  width: 80%;
  margin: 0 auto;
}

.card-container {
  width: 255px;
  height: 356px;
  margin: 5px;
}

#show-alert {
  pointer-events: none;
}

#decklist-alert {
  width: 200px;
  background: #FFFD;
  padding: 0 10px;
  border: 1px solid #555;
  border-radius: 3px;
  transition: 1s;
  pointer-events: all;
}

#decklist-alert span {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 14pt;
}

#decklist-alert span:hover {
  color: red;
}

.show #decklist-alert {
  margin-right: 20px;
}

.slide-in {
  overflow: hidden;
}

.slide-in.from-right {
  right: 0;
}

.slide-in.from-left {
  left: 0;
}

.slide-in-content {
  padding: 5px 20px;
  background: #eee;
  transition: transform .5s ease;
}

.slide-in.from-right .slide-in-content {
  transform: translateX(100%);
  -webkit-transform: translateX(100%);
}

.slide-in.from-left .slide-in-content {
  transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
}

.slide-in.show .slide-in-content {
  transform: translateX(0%);
  -webkit-transform: translateX(0%);
}

.alert {
  width: 200px;
  background: white;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #555;
  margin: 3px 0px;
  cursor: pointer;
  background: #fffe;
}

#search-container {
  display: flex;
  justify-content: center;
  margin: 20px 0px;
}

#search-bar {
  width: 50%;
  padding: 3px;
  font-size: 18px;
  border: none;
  outline: none;
  margin-left: 20px
}

#advanced-search:hover {
  cursor: pointer;
  -webkit-filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, 0.3));
  filter: drop-shadow( 0px 0px 3px rgba(0, 0, 0, 0.3));
}

#search-error {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 10px;
  margin: 0;
  width: 100%;
  text-align: center;
  background: tomato;
  color: white;
  font-size: 12px;
  height: 0;
  transition: 0.32s;
  z-index: 1;
}
#search-error.error {
  height: auto;
  padding: 10px;
}

#no-results {
  text-align: center;
  color: #555;
}
</style>
