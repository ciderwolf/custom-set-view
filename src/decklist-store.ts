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
      this.newDeck('New Deck');
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
      this.decklists[this.currentDeckName] = { maindeck: [], sideboard: [] };
    }

    return this.decklists[this.currentDeckName];
  }

  public set currentDeck(deck: Deck) {
    this.decklists[this.currentDeckName] = deck;
  }

  public get deckNames(): string[] {
    return Object.keys(this.decklists);
  }

  public newDeck(name: string): Deck {
    this.currentDeckName = name;
    return this.currentDeck;
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
    const deck = this.decklists[this.currentDeckName];
    delete this.decklists[this.currentDeckName];
    this.decklists[newName] = deck;
    this.currentDeckName = newName;
  }

  public deleteCurrentDeck() {
    delete this.decklists[this.currentDeckName];
    if (this.deckNames.length > 0) {
      this.currentDeckName = this.deckNames[this.deckNames.length - 1];
    } else {
      this.currentDeckName = 'New Deck';
    }
  }
}
