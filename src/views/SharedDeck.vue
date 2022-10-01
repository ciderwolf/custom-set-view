<template>
  <div id="shared-deck">
    <div v-if="name">
      <div class="title">
        <h1>{{ name }}</h1>
        <button class="button" @click="openDeckbuilder()">Edit a Copy</button>
      </div>
      <deck-preview :deck="deck"></deck-preview>
    </div>
    <div v-else>
      <h2>Oops, looks like something went wrong.</h2>
      <p>We couldn't find a deck for that URL.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cardFromNumber } from '@/deck';
import DeckPreview from '@/components/DeckPreview.vue';
import { useDecksStore, type Deck } from '@/stores/decks';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

function parseDeck(code: string) {
  const [name, maindeck, sideboard] = code.split('\n');
  const main = maindeck.split('\t').map((line) => {
    const [count, num] = line.split(' ').map(Number);
    return {
      name: cardFromNumber(num),
      count,
    };
  });
  const side = sideboard.split('\t').map((line) => {
    const [count, num] = line.split(' ').map(Number);
    return {
      name: cardFromNumber(num),
      count,
    };
  });
  return {
    name,
    deck: {
      maindeck: main,
      sideboard: side,
    },
  };
}

const deck = ref<Deck>({ maindeck: [], sideboard: [] });
const name = ref("");
const decks = useDecksStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  try {
    const deckCode = route.query.deck as string;
    const result = parseDeck(atob(deckCode));
    deck.value = result.deck as Deck;
    name.value = result.name;
  } catch (e: any) {
    console.error(e.message);
  }
})

function openDeckbuilder() {
  decks.addDeckNamed(name.value, deck.value);
  router.push('/deckbuilder');
}
</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  background: white;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 5px;
  cursor: pointer;
  height: min-content;
  transition: 0.3s;
}

.button:hover {
  background: #0001;
}

.button:hover:active {
  background: #0003;
}
</style>
