<template>
  <div>
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
          <select ref="deckSelector"
            @input="selectDeck(this)"
            v-model="options.selectedDeck">
            <option disabled>Choose a deck</option>
            <option v-for="name in deckNames" :key="name" :value="name">{{name}}</option>
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
      </div>
    </div>
    <div id="deckbuilder">
      <div id="input">
        <tabs :options="{ useUrlFragment: false }">
          <tab name="Maindeck">
            <textarea id="maindeck-input" spellcheck="false"
              placeholder="Maindeck (60 cards)" v-model="maindeck"></textarea>
          </tab>
          <tab name="Sideboard">
            <textarea id="sideboard-input" spelcheck="false"
              placeholder="Sideboard (15 cards)" v-model="sideboard"></textarea>
          </tab>
        </tabs>
        <button id="preview-button" class="button" @click="parseInput()">Update Preview</button>
      </div>
      <div id="deck-view">
        <deck-preview :deck="deck"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Tabs, Tab } from 'vue-tabs-component';
import DeckPreview from '@/components/DeckPreview.vue';

export default {
  data() {
    return {
      maindeck: '',
      sideboard: '',
      options: {
        exportMode: 'download',
        selectedDeck: undefined,
        deckName: '',
        newDeckName: '',
      },
      deck: { maindeck: [], sideboard: [] },
    };
  },
  methods: {
    parseInput() {
      const deck = {
        maindeck: [],
        sideboard: [],
      };

      deck.maindeck = this.maindeck.trim().split('\n').map((line) => {
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
      }).filter((x) => x !== undefined);

      deck.sideboard = this.sideboard.trim().split('\n').map((line) => {
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
      }).filter((x) => x !== undefined);
      this.$decks.currentDeck = deck;
      this.deck = deck;
    },
    showModal() {
      document.getElementById('deck-options').style.display = 'block';
    },
    dismissModal(e = null) {
      const modal = document.getElementById('deck-options');
      if (e === null || e.target === modal) {
        modal.style.display = 'none';
      }
    },
    deckSize(name) {
      const deck = this.$decks.currentDeck[name];
      const size = deck.reduce((acc, item) => acc + item.count, 0);
      return size;
    },
    renameDeck() {
      this.$decks.setCurrentDeckName(this.options.deckName);
      this.dismissModal();
      this.chooseDeck();
    },
    createNewDeck() {
      this.deck = this.$decks.newDeck(this.options.newDeckName);
      this.dismissModal();
      this.chooseDeck();
    },
    selectDeck() {
      this.$decks.currentDeckName = this.$refs.deckSelector.value;
      this.dismissModal();
      this.chooseDeck();
    },
    deleteDeck() {
      this.$decks.deleteCurrentDeck();
      this.options.selectedDeck = this.$store.getters.currentDeckName;
      this.dismissModal();
      this.chooseDeck();
    },
    exportDeck() {
      const mode = this.options.exportMode;
      const text = `${this.maindeck}\n\n${this.sideboard}`;
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
        a.download = `${this.currentDeckName}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    },
    chooseDeck() {
      this.deck = this.$store.getters.currentDeck;
      this.maindeck = this.deck.maindeck.map((card) => `${card.count} ${card.name}`).join('\n');
      this.sideboard = this.deck.sideboard.map((card) => `${card.count} ${card.name}`).join('\n');
    },
  },
  mounted() {
    this.options.selectedDeck = this.currentDeckName;
    this.chooseDeck();
  },
  computed: {
    currentDeckName() {
      return this.$store.getters.currentDeckName;
    },
    deckNames() {
      return this.$store.getters.deckNames;
    },
  },
  components: { Tab, Tabs, DeckPreview },
};
</script>

<style>
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
}

.button.danger {
  border-color: maroon;
  color: maroon;
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
  -webkit-filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, 0.3));
  filter: drop-shadow( 0px 0px 3px rgba(0, 0, 0, 0.3));
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
