interface DeckCard {
  name: string;
  count: number;
}
interface Deck {
  maindeck: DeckCard[];
  sideboard: DeckCard[];
}
interface Decklist {
  [part: string]: {
    count: number;
    name: string;
    image_uri: string;
  }[];
}

class DecklistStore {
  private decklists: Record<string, Deck>
  public currentDeckName: string;

  constructor() {
    this.decklists = JSON.parse(window.localStorage.getItem('decks') ?? '{}');
    this.currentDeckName = window.localStorage.getItem('currentDeckName') ?? '';
    window.onbeforeunload = () => {
      window.localStorage.setItem('decks', JSON.stringify(this.decklists));
      window.localStorage.setItem('currentDeckName', this.currentDeckName);
    };
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

export default DecklistStore;
