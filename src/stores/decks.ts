import { defineStore } from "pinia";

export interface DeckCard {
  name: string;
  count: number;
}
export interface Deck {
  maindeck: DeckCard[];
  sideboard: DeckCard[];
}

export const useDecksStore = defineStore({
  id: "decks",
  state: () => ({
    decklists: {} as {[index: string]: Deck},
    currentDeckName: '',
  }),
  actions: {
    setCurrentDeckName(deckName: string) {
      this.currentDeckName = deckName;
    },
    setDecklists(decklists: {[index: string]: Deck}) {
      this.decklists = decklists;
    },
    renameCurrentDeck(newName: string) {
      const deck = this.decklists[this.currentDeckName];
      delete this.decklists[this.currentDeckName];

      this.currentDeckName = newName;
      this.decklists[this.currentDeckName] = deck;
    },
    addDeck() {
      let name = this.currentDeckName;
      let count = 1;
      while (Object.keys(this.decklists).includes(name)) {
        count += 1;
        name = `${this.currentDeckName} (${count})`;
      }
      
      if (name !== this.currentDeckName) {
        this.currentDeckName = name;
      }
      this.decklists[this.currentDeckName] = { maindeck: [], sideboard: [] }
    },
    removeDeck() {
      delete this.decklists[this.currentDeckName];
    },
    setDeck(deck: Deck) {
      this.decklists[this.currentDeckName] = deck;
    },

    // utils
    addCardToCurrentDeck(cardName: string, count = 1, sideboard = false) {
      if (sideboard) {
        const match = this.currentDeck.sideboard.find((value) => value.name === cardName);
        if (match === undefined) {
          this.currentDeck.sideboard.push({ name: cardName, count });
        } else {
          match.count += count;
        }
      } else {
        const match = this.currentDeck.maindeck.find((value) => value.name === cardName);
        if (match === undefined) {
          this.currentDeck.maindeck.push({ name: cardName, count });
        } else {
          match.count += count;
        }
      }
    },
    createNewDeck(name: string) {
      this.currentDeckName = name || 'New Deck';
      this.addDeck();
      return this.currentDeck;
    },
    selectDeck(name: string) {
      this.currentDeckName = name;
    },
    deleteCurrentDeck() {
      this.removeDeck();
      if (this.deckNames.length > 0) {
        this.currentDeckName = this.deckNames[this.deckNames.length - 1];
      } else {
        this.currentDeckName = 'New Deck';
      }
    },
    addDeckNamed(name: string, deck: Deck) {
      this.createNewDeck(name);
      this.setDeck(deck);
    }
  },
  getters: {
    currentDeck(state) {
      return state.decklists[state.currentDeckName];
    },
    deckNames(state) {
      return Object.keys(state.decklists);
    },
  },
})

export function initDeckStore() {
  const store = useDecksStore();
  store.decklists = JSON.parse(window.localStorage.getItem('decks') ?? '{}');
  store.currentDeckName = JSON.parse(window.localStorage.getItem('currentDeckName') ?? '""');
  if (store.currentDeckName === '') {
    store.createNewDeck('New Deck');
  }
  window.onbeforeunload = () => {
    window.localStorage.setItem('decks', JSON.stringify(store.decklists));
    window.localStorage.setItem('currentDeckName', JSON.stringify(store.currentDeckName));
  };
}