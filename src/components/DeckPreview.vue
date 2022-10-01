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
          <card-preview v-for="card of section.cards" :key="card.name" :card="card" />
        </div>
      </div>
      <div class="row">
        <div class="type" v-for="section of rowTwo" :key="section.title">
          <h3>{{ section.title }} ({{ section.count }})</h3>
          <card-preview v-for="card of section.cards" :key="card.name" :card="card" />
        </div>
      </div>
      <div class="row">
        <div class="type">
          <h3>{{ sideboard.title }} ({{ sideboard.count }})</h3>
          <card-preview v-for="card of sideboard.cards" :key="card.name" :card="card" />
        </div>
        <div class="type" v-if="unknowns.count > 0">
          <h3>{{ unknowns.title }} ({{ unknowns.count }})</h3>
          <p v-for="card of unknowns.cards" :key="card.name">{{ card.count }} {{ card.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardPreview from '@/components/CardPreview.vue';
import { findCard, getType } from '@/deck';
import { onMounted, ref, watchEffect } from 'vue';
import type { Deck, DeckCard } from '@/stores/decks';

const props = defineProps<{ deck: Deck }>();

interface Card extends DeckCard {
  count: number;
  name: string;
  simpleName: string;
}

// interface Deck {
//   maindeck: Card[];
//   sideboard: Card[];
// }

interface CardColumn {
  title: string;
  count: number;
  cards: Card[];
}

function createColumn(typename: string, cardlist: Card[]): CardColumn {
  const size = cardlist.reduce((acc, item) => acc + item.count, 0);
  return {
    title: typename,
    count: size,
    cards: cardlist,
  };
}

function makeColumns(decklist: { [type: string]: Card[] }): [CardColumn[], CardColumn[]] {
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

function makeDecklist(deck: Deck): [CardColumn[], CardColumn[], CardColumn, CardColumn] {
  const decklist: { [type: string]: Card[] } = {};
  const unknowns: Card[] = [];
  deck.maindeck.forEach((card) => {
    const cardObj = findCard(card.name);
    if (cardObj === null) {
      unknowns.push({ ...card, simpleName: card.name });
      return;
    }

    const type = getType(cardObj, card.name);
    if (!(type in decklist)) {
      decklist[type] = [];
    }
    decklist[type].push({
      count: card.count,
      name: cardObj.name,
      simpleName: cardObj.simple_name,
    });
  });

  const sideboard = deck.sideboard.map((card) => {
    const cardObj = findCard(card.name);
    if (cardObj === null) {
      unknowns.push({ ...card, simpleName: card.name });
      return undefined;
    }
    return {
      count: card.count,
      name: cardObj.name,
      simpleName: cardObj.simple_name,
    };
  }).filter((x) => x !== undefined) as Card[];

  const [one, two] = makeColumns(decklist);
  return [one, two, createColumn('Sideboard', sideboard), createColumn('Unknown', unknowns)];
}

function getColors(cards: (Card | DeckCard)[]): Colors {
  const colors: { [name: string]: number } = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
  };
  let colorSum = 0;
  cards.forEach((card) => {
    const cardObject = findCard(card.name);
    if (cardObject === null) {
      return;
    }
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
  const style: Colors = {};
  Object.keys(colors).forEach((color) => {
    const data = {
      width: `${colors[color] * (100 / colorSum)}%`,
      title: `${colors[color]} ${color} symbols`,
    };
    style[color] = data;
  });
  return style;
}
function displayDeck() {
  const [one, two, sb, uk] = makeDecklist(props.deck);
  colors.value = getColors([...props.deck.maindeck, ...props.deck.sideboard]);
  rowOne.value = one;
  rowTwo.value = two;
  sideboard.value = sb;
  unknowns.value = uk;
  console.log("rerender");
}

interface Colors {
  [name: string]: {
    width: string;
    title: string;
  }
}


const rowOne = ref<CardColumn[]>([]),
  rowTwo = ref<CardColumn[]>([]),
  sideboard = ref<CardColumn>({} as CardColumn),
  unknowns = ref<CardColumn>({} as CardColumn);
const colors = ref<Colors>({
  W: {},
  U: {},
  B: {},
  R: {},
  G: {},
} as unknown as Colors)

watchEffect(() => {
  props.deck;
  displayDeck();
});

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
  background-color: rgb(0, 0, 0);
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

.type p {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
