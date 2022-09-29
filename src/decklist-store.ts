/* eslint-disable class-methods-use-this */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface DeckCard {
  name: string;
  count: number;
}
interface Deck {
  maindeck: DeckCard[];
  sideboard: DeckCard[];
}

export const store = new Vuex.Store({
  state: {
    decklists: {} as {[index: string]: Deck},
    currentDeckName: '',
  },
  mutations: {
    setCurrentDeckName(state, deckName) {
      state.currentDeckName = deckName;
    },
    setDecklists(state, decklists) {
      state.decklists = decklists;
    },
    renameCurrentDeck(state, newName: string) {
      const deck = state.decklists[state.currentDeckName];
      Vue.delete(state.decklists, state.currentDeckName);
      state.currentDeckName = newName;
      Vue.set(state.decklists, state.currentDeckName, deck);
    },
    addDeck(state) {
      let name = state.currentDeckName;
      let count = 1;
      while (Object.keys(state.decklists).includes(name)) {
        count += 1;
        name = `${state.currentDeckName} (${count})`;
      }
      console.log(name, state.currentDeckName, Object.keys(state.decklists));
      if (name !== state.currentDeckName) {
        state.currentDeckName = name;
      }
      Vue.set(state.decklists, state.currentDeckName, { maindeck: [], sideboard: [] });
    },
    removeDeck(state) {
      Vue.delete(state.decklists, state.currentDeckName);
    },
    setDeck(state, deck: Deck) {
      Vue.set(state.decklists, state.currentDeckName, deck);
    },
  },
  getters: {
    currentDeckName(state) {
      return state.currentDeckName;
    },
    currentDeck(state) {
      return state.decklists[state.currentDeckName];
    },
    deckNames(state) {
      return Object.keys(state.decklists);
    },
    decklists(state) {
      return state.decklists;
    },
  },
});

export class DecklistStore {
  constructor() {
    this.decklists = JSON.parse(window.localStorage.getItem('decks') ?? '{}');
    this.currentDeckName = JSON.parse(window.localStorage.getItem('currentDeckName') ?? '""');
    if (this.currentDeckName === '') {
      this.createNewDeck('New Deck');
    }
    window.onbeforeunload = () => {
      window.localStorage.setItem('decks', JSON.stringify(this.decklists));
      window.localStorage.setItem('currentDeckName', JSON.stringify(this.currentDeckName));
    };
  }

  private get decklists(): Record<string, Deck> {
    return store.getters.decklists;
  }

  private set decklists(decklists) {
    store.commit('setDecklists', decklists);
  }

  public get currentDeckName(): string {
    return store.getters.currentDeckName;
  }

  public set currentDeckName(name: string) {
    store.commit('setCurrentDeckName', name);
  }

  public get currentDeck(): Deck {
    if (this.decklists[this.currentDeckName] === undefined) {
      store.commit('addDeck');
    }

    return this.decklists[this.currentDeckName];
  }

  public get deckNames(): string[] {
    return store.getters.deckNames;
  }

  public createNewDeck(name: string): Deck {
    this.currentDeckName = name || 'New Deck';
    store.commit('addDeck');
    return this.currentDeck;
  }

  public addDeck(name: string, deck: Deck) {
    this.createNewDeck(name);
    this.setCurrentDeck(deck);
  }

  public selectDeck(name: string) {
    this.currentDeckName = name;
  }

  public addCardToCurrentDeck(cardName: string, count = 1, sideboard = false) {
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
  }

  public setCurrentDeckName(newName: string) {
    store.commit('renameCurrentDeck', newName);
  }

  public setCurrentDeck(deck: Deck) {
    store.commit('setDeck', deck);
  }

  public deleteCurrentDeck() {
    store.commit('removeDeck');
    if (this.deckNames.length > 0) {
      this.currentDeckName = this.deckNames[this.deckNames.length - 1];
    } else {
      this.currentDeckName = 'New Deck';
    }
  }
}
