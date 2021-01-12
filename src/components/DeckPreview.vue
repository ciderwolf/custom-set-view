<template>
  <div>
    <div class="color-bar">
      <div class="color white" :style="{width: colors.W.width}" :title="colors.W.title"></div>
      <div class="color blue" :style="{width: colors.U.width}" :title="colors.U.title"></div>
      <div class="color black" :style="{width: colors.B.width}" :title="colors.B.title"></div>
      <div class="color red" :style="{width: colors.R.width}" :title="colors.R.title"></div>
      <div class="color green" :style="{width: colors.G.width}" :title="colors.G.title"></div>
    </div>
    <div class="deck-preview">
      <div class="row">
        <div class="type" v-for="section of rowOne" :key="section.title">
          <h3>{{ section.title }} ({{ section.count }})</h3>
          <card-preview v-for="card of section.cards" :key="card.name" :card="card"/>
        </div>
      </div>
      <div class="row">
        <div class="type" v-for="section of rowTwo" :key="section.title">
          <h3>{{ section.title }} ({{ section.count }})</h3>
          <card-preview v-for="card of section.cards" :key="card.name" :card="card"/>
        </div>
      </div>
      <div class="row">
        <div class="type">
          <h3>{{ sideboard.title }} ({{ sideboard.count }})</h3>
          <card-preview v-for="card of sideboard.cards" :key="card.name" :card="card"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardPreview from '@/components/CardPreview.vue';
import { getCards } from '@/search';

const allCards = getCards();
const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];

function findCard(name) {
  const foundCard = Object.values(allCards)
    .find((card) => (card.name === name || card.simple_name === name));
  return foundCard || null;
}

function getType(card, name) {
  if (basicLands.includes(name)) {
    return 'Land';
  } if (card === undefined) {
    return 'Unknown';
  }
  let type;
  let counter = 0;
  do {
    type = card.types[counter];
    counter += 1;
  } while (type === 'Legendary');
  return type;
}

function createColumn(typename, cardlist) {
  const size = cardlist.reduce((acc, item) => acc + item.count, 0);
  return {
    title: typename,
    count: size,
    cards: cardlist,
  };
}

function makeColumns(decklist) {
  const rowOnes = []; const rowTwos = []; let rowOneTotal = 0; let rowTwoTotal = 0;
  const rows = Object.keys(decklist).reverse()
    .map((key) => ({ count: decklist[key].length, name: key }));

  rows.sort((a, b) => b.count - a.count);

  while (rows.length > 0) {
    const current = rows[0];
    if (rowOneTotal <= rowTwoTotal) {
      rowOnes.push(current);
      rowOneTotal += current.count + 4;
    } else {
      rowTwos.push(current);
      rowTwoTotal += current.count + 4;
    }
    rows.splice(0, 1);
  }
  return [
    rowOnes.map((item) => createColumn(item.name, decklist[item.name])),
    rowTwos.map((item) => createColumn(item.name, decklist[item.name])),
  ];
}

function makeDecklist(deck) {
  const decklist = {};
  deck.maindeck.forEach((card) => {
    const cardObj = findCard(card.name);
    if (cardObj === null) {
      return;
    }

    const type = getType(cardObj, card.name);
    if (!(type in decklist)) {
      decklist[type] = [];
    }
    decklist[type].push({
      count: card.count,
      name: cardObj.name,
      simpleName: card.name,
    });
  });

  const sideboard = deck.sideboard.map((card) => {
    const cardObj = findCard(card.name);
    if (cardObj === null) {
      return undefined;
    }
    return {
      count: card.count,
      name: cardObj.name,
      simpleName: card.name,
    };
  }).filter((x) => x !== undefined);
  return [...makeColumns(decklist), createColumn('Sideboard', sideboard)];
}

function getColors(cards) {
  const colors = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
  };
  let colorSum = 0;
  cards.forEach((card) => {
    const cardObject = findCard(card.name);
    const cardCost = cardObject.cost || '';
    Array.from(cardCost).forEach((symbol) => {
      if (symbol in colors) {
        colors[symbol] += card.count;
        colorSum += card.count;
      }
    });
  });
  if (colorSum === 0) {
    colorSum = 1;
  }
  const style = {};
  Object.keys(colors).forEach((color) => {
    const data = {
      width: `${colors[color] * (100 / colorSum)}%`,
      title: `${colors[color]} ${color} symbols`,
    };
    style[color] = data;
  });
  return style;
}

export default {
  data() {
    return {
      rowOne: [],
      rowTwo: [],
      sideboard: {},
      colors: {
        W: {},
        U: {},
        B: {},
        R: {},
        G: {},
      },
    };
  },
  watch: {
    deck() {
      const [one, two, sideboard] = makeDecklist(this.deck);
      this.colors = getColors([...this.deck.maindeck, ...this.deck.sideboard]);
      this.rowOne = one;
      this.rowTwo = two;
      this.sideboard = sideboard;
    },
  },
  props: ['deck'],
  name: 'DeckPreview',
  components: { CardPreview },
};
</script>

<style>

.color-bar {
  display: flex;
}
.color {
  height: 7px;
}
.color-bar .white {
  background-color: rgb(236, 217, 191);
}

.color-bar .blue {
  background-color: rgb(22, 90, 199);
}

.color-bar .black {
  background-color: rgb(0,0,0);
}

.color-bar .red {
  background-color: rgb(211, 52, 52);
}

.color-bar .green {
  background-color: rgb(49, 192, 49);
}

.deck-preview {
  display: flex;
}

.row {
  min-width: 33%;
}

.type {
  padding: 20px;
}
</style>
