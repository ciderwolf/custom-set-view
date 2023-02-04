<template>
  <div id="deckbuilder-view">
    <div id="title">
      <router-link to="/"><img src="@/assets/heron_small.png" id="heron-logo" /></router-link>
      <h1>Deckbuilder</h1>
      <router-link to="/search">Search for Cards</router-link>
      <img src="@/assets/gear.svg" id="options-button" @click="showModal()">
    </div>
    <h2>{{ currentDeckName }}
      ({{ deckSize('maindeck') }}/{{ deckSize('sideboard') }})</h2>
    <div id="deck-options" @click="dismissModal">
      <span @click="dismissModal()">&times;</span>
      <div id="modal-content">
        <h2>Deck Options</h2>
        <div class="option">
          <label for="deck-selector">Select Deck: </label>
          <select v-model="options.selectedDeck">
            <option disabled>Choose a deck</option>
            <option v-for="name in deckNames" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <hr />
        <div class="option">
          <input type="text" v-model="options.newDeckName" placeholder="Deck Name">
          <button class="button" @click="createNewDeck()">New Deck</button>
        </div>
        <hr />
        <div class="option">
          <select v-model="options.exportMode">
            <option value="clipboard">Copy to Clipboard</option>
            <option value="download">Download Text</option>
          </select>
          <button class="button" @click="exportDeck()">Export Deck</button>
        </div>
        <hr />
        <div class="option">
          <div>
            <input type="text" v-model="options.deckName" placeholder="Deck Name">
            <button class="button" @click="renameDeck()">Rename Deck</button>
          </div>
          <button class="button danger" @click="deleteDeck()">Delete Deck</button>
        </div>
        <hr />
        <div class="option">
          <div>
            <input type="text" v-model="deckCodeURL" placeholder="Deck URL">
          </div>
          <button class="button" @click="generateCode()">Generate Shareable URL</button>
        </div>
      </div>
    </div>
    <div id="deckbuilder">
      <div id="input">
        <tabs :options="{ useUrlFragment: false }">
          <tab name="Maindeck">
            <textarea id="maindeck-input" spellcheck="false" placeholder="Maindeck (60 cards)"
              v-model="maindeck"></textarea>
          </tab>
          <tab name="Sideboard">
            <textarea id="sideboard-input" spelcheck="false" placeholder="Sideboard (15 cards)"
              v-model="sideboard"></textarea>
          </tab>
        </tabs>
        <button id="preview-button" class="button" @click="parseInput()">Update Preview</button>
      </div>
      <div id="deck-view">
        <deck-preview :deck="deck" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab, Tabs } from 'vue3-tabs-component';
import DeckPreview from '@/components/DeckPreview.vue';
import { findCard } from '@/deck';
import { useDecksStore, type Deck, type DeckCard } from '@/stores/decks';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';

const decks = useDecksStore();

const { currentDeckName, currentDeck, deckNames } = storeToRefs(decks)

function makeCode(deck: Deck, name: string) {
  const maindeck = deck.maindeck.map((card) => {
    const obj = findCard(card.name)!;
    return `${card.count} ${obj.number}`;
  }).join('\t');
  const sideboard = deck.sideboard.map((card) => {
    const obj = findCard(card.name)!;
    return `${card.count} ${obj.number}`;
  }).join('\t');
  return `${name}\n${maindeck}\n${sideboard}`;
}

function parseInput() {
  deckCodeURL.value = '';
  const deckData: Deck = {
    maindeck: [],
    sideboard: [],
  };

  deckData.maindeck = maindeck.value.trim().split('\n').map((line) => {
    if (line.trim().length === 0) {
      return undefined;
    }
    let name = line;
    const countString = line.substring(0, line.indexOf(' '));
    let count = 1;
    if (!Number.isNaN(Number(countString))) {
      count = Number(countString);
      name = line.substring(line.indexOf(' ') + 1);
    }
    return {
      name,
      count,
    };
  }).filter((x) => x !== undefined) as DeckCard[];

  deckData.sideboard = sideboard.value.trim().split('\n').map((line) => {
    let name = line;
    const countString = line.substring(0, line.indexOf(' '));
    let count = 1;
    if (!Number.isNaN(Number(countString))) {
      count = Number(countString);
      name = line.substring(line.indexOf(' ') + 1);
    }
    if (count !== 0) {
      return {
        name,
        count,
      };
    }
    return undefined;
  }).filter((x) => x !== undefined) as DeckCard[];
  decks.setDeck(deckData);

  deck.value = deckData;
}


function showModal() {
  const modal = document.getElementById('deck-options');
  if (modal) {
    modal.style.display = 'block';
  }
}

function dismissModal(e: MouseEvent | null = null) {
  const modal = document.getElementById('deck-options');
  if (modal && (e === null || e.target === modal)) {
    modal.style.display = 'none';
  }
}

function deckSize(name: keyof Deck) {
  const deck = currentDeck.value[name];
  const size = deck.reduce((acc, item) => acc + item.count, 0);
  return size;
}

function renameDeck() {
  decks.renameCurrentDeck(options.value.deckName);
  options.value.selectedDeck = options.value.deckName;
  dismissModal();
}
function createNewDeck() {
  deck.value = decks.createNewDeck(options.value.newDeckName);
  dismissModal();
  chooseDeck();
}
function selectDeck() {
  decks.selectDeck(options.value.selectedDeck);
  dismissModal();
  chooseDeck();
}
function deleteDeck() {
  decks.deleteCurrentDeck();
  options.value.selectedDeck = decks.currentDeckName;
  dismissModal();
  chooseDeck();
}
function exportDeck() {
  const mode = options.value.exportMode;
  const text = `${maindeck.value}\n\n${sideboard.value}`;
  if (mode === 'clipboard') {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  } else if (mode === 'download') {
    const url = window.URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${currentDeckName}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
function chooseDeck() {
  deck.value = decks.currentDeck;
  maindeck.value = deck.value.maindeck.map((card) => `${card.count} ${card.name}`).join('\n');
  sideboard.value = deck.value.sideboard.map((card) => `${card.count} ${card.name}`).join('\n');
  deckCodeURL.value = '';
}
function generateCode() {
  const code = makeCode(currentDeck.value, currentDeckName.value);
  const url = `${window.location.origin}/deck?deck=${btoa(code)}`;
  deckCodeURL.value = url;
}
const maindeck = ref('');
const sideboard = ref('');

const deckCodeURL = ref('');
const deck = ref<Deck>({ maindeck: [], sideboard: [] });
const options = ref({
  exportMode: 'download',
  selectedDeck: '',
  deckName: '',
  newDeckName: '',
});

onMounted(() => {
  options.value.selectedDeck = currentDeckName.value;
  chooseDeck();
})

watch([() => options.value.selectedDeck], () => {
  selectDeck();
})
</script>

<style>
#deckbuilder-view {
  margin-left: 5px;
}

.tabs-component-tabs {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.tabs-component-tab {
  border: none;
  background: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  width: fit-content;
}

.tabs-component-tab:hover {
  background: #EEF6
}

.tabs-component-tab.is-active {
  color: #557;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: .75em 1em;
  text-decoration: none;
}
</style>

<style scoped>
#heron-logo {
  margin-top: -7px;
  padding-right: 15px;
}

.button {
  background: white;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.button:hover {
  background: #0001;
}

.button:hover:active {
  background: #0003;
}

.button.danger {
  border-color: maroon;
  color: maroon;
}

.button.danger:hover {
  background: #80000011;
}

.button.danger:hover:active {
  background: #80000033;
}

#title {
  display: flex;
}

#title a {
  margin-top: 2em;
  margin-left: 30px;
  text-decoration: none;
  color: rgb(74, 74, 202);
  height: fit-content;
}

#title a:hover {
  text-decoration: underline;
}

#options-button {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 30px;
  top: 30px;
  cursor: pointer;
}

#options-button:hover {
  cursor: pointer;
  -webkit-filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3));
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
}

#deck-options {
  display: none;
  background: #000A;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

#deck-options span {
  font-size: 24pt;
  position: absolute;
  top: 30px;
  right: 30px;
  color: black;
  cursor: pointer;
}

#deck-options span:hover {
  color: red;
}

#modal-content {
  background-color: white;
  margin: 5% auto 15% auto;
  border: 1px solid #888;
  width: 50%;
  padding: 30px;
}

#modal-content input[type="text"] {
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #555;
  margin: 10px 0;
  padding: 5px;
}

#modal-content select {
  font-size: 14px;
  margin: 10px 0;
  background: white;
  color: #333;
}

.option {
  display: flex;
  justify-content: space-between;
}

.option .button {
  padding: 5px;
  height: fit-content;
  margin: 10px 0;
}

#deckbuilder {
  display: flex;
}

#input {
  width: 20%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
}

#input textarea {
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#preview-button {
  margin: 0 auto;
  width: max-content;
}

#deck-view {
  width: 70%;
  margin-top: 30px;
  margin-left: 5%;
  margin-right: 5%;
}

#color-bar {
  display: flex;
}

.color {
  height: 7px;
}

h3:first-child {
  margin-top: 0;
}

.card-preview {
  display: none;
  background-size: 224px auto;
  height: 310px;
  position: absolute;
  z-index: 2;
  border: 3px solid white;
  border-radius: 5px;
  pointer-events: none;
}

.deck {
  display: flex;
}

.row {
  min-width: 33%;
}

.card-line {
  margin-top: 0;
  margin-bottom: 0;
}

.type {
  padding: 20px;
}
</style>
