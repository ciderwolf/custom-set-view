<template>
  <div class="search">
    <div id="search-container">
      <router-link to="/">
        <img src="@/assets/heron_small.png" style="padding-right: 15px" />
      </router-link>
      <label for="search-bar">
        <img width="20" height="20" style="margin-top: 4px" src="@/assets/magnifying-glass.png" />
      </label>
      <input type="text" v-model="searchText" @input="searchBarInput" placeholder="Search for cards..." id="search-bar">
      <router-link to="advanced">
        <img width="20" height="20" id="advanced-search" style="margin-top: 4px" src="@/assets/gear.svg" />
      </router-link>
      <p id="search-error"></p>
    </div>
    <div id="card-img">
      <div v-for="card in results" :key="card.name" class="card-container" @mouseenter="hover(card.simple_name, true)"
        @mouseleave="hover(undefined, false)">
        <router-link :to="'/search/card?name=' + card.simple_name">
          <CardImage :card="card" size="small" />
        </router-link>
      </div>
    </div>
    <h3 id="no-results" v-if="results.length === 0">No search results found</h3>
    <added-cards ref="addedCards" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { search } from '@/search';
import { useNotificationStore } from '@/stores/notifications'
import type { Card } from '@/card'
import CardImage from '@/components/CardImage.vue';
import AddedCards from '@/components/AddedCards.vue';

const router = useRouter();
const notifications = useNotificationStore();

const searchText = ref('');
const results = ref<Card[]>([]);
let card: string | undefined = undefined;

async function searchBarInput() {
  executeSearch();
  if (searchText.value !== '') {
    router.replace(`/search?q=${searchText.value}`);
  } else {
    router.replace('/search');
  }
}
function executeSearch() {
  results.value = search(searchText.value);
}
function hover(name: string | undefined, on: boolean) {
  if (on) {
    card = name;
  } else {
    card = undefined;
  }
}

function keyPressed(e: KeyboardEvent) {
  if ((e.key !== 'a' && e.key !== 's') || document.activeElement?.id === 'search-bar') {
    return;
  }
  if (card) {
    notifications.push(card, e.key === 's');
  }
}



const route = useRoute();

onMounted(() => {
  searchText.value = (route.query.q || '') as string;
  executeSearch();
  window.addEventListener('keypress', keyPressed);
});

onUnmounted(() => {
  window.removeEventListener('keypress', keyPressed);
})

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
  -webkit-filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
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
