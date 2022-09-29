import { getCards } from '@/search';
import { Card } from './card';

const allCards = getCards();
const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];

export function findCard(name: string) {
  if (basicLands.includes(name)) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return { name, simple_name: name, number: -basicLands.indexOf(name) - 1 };
  }
  const foundCard = Object.values(allCards)
    .find((card) => (card.name === name || card.simple_name === name));
  return foundCard || null;
}

export function getType(card: Card, name: string) {
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

export function cardFromNumber(num: number) {
  if (num < 0) {
    return basicLands[-(num + 1)];
  }
  return allCards.find((card) => card.number === num)?.name;
}
