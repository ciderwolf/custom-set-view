import data from '@/assets/data.json';
import { parse } from './query';
import { type Card, CardSet, type ColorKey } from './card';

const set = new CardSet(data);

function cardMatches(type: string, value: any, card: Card): boolean | undefined {
  if (type === '$and' || type === '$or') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return cardMatchesConditions(value, card, type === '$and');
  } if (type === 'allNames') {
    return card.name.match(value) != null;
  } if (type === 'text') {
    const processedText = card.text.replace(new RegExp(card.name, 'g'), '~');
    return processedText.match(value) != null
    || card.flavor.match(value) != null
    || card.text.match(value) != null;
  } if (type === 'allTypes') {
    const match = card.types.find((st) => st.toLowerCase() === value);
    return match !== undefined;
  } if (type === 'rarity') {
    return card.rarity.charAt(0) === value.charAt(0);
  } if (type === 'mana') {
    return card.cost === value.replaceAll('{', '').replaceAll('}', '');
  } if (type === 'colors') {
    if (value.$in) {
      const colors: ColorKey[] = value.$in;
      const matchesAll = colors.some((color) => CardSet.cardHasColor(card, color));
      return matchesAll;
    } if (value.$nin) {
      const colors: ColorKey[] = value.$nin;
      if (colors.some((color) => CardSet.cardHasColor(card, color))) {
        return false;
      }

      return true;
    } if (value.$size) {
      return card.color.length === value.$size;
    } if (value.$exists !== undefined) {
      return (card.color !== 'C') === value.$exists || (card.color.length !== 0) === value.$exists;
    }
  } else if (type === 'colors.1') {
    return card.color.length > 1 === value.$exists;
  } else if (type === 'power' || type === 'toughness' || type === 'loyalty' || type === 'cmc') {
    const compare = type === 'cmc' ? CardSet.cardGetCmc(card) : card[type];
    if (value.$gt !== undefined) {
      return compare > value.$gt;
    } if (value.$gte !== undefined) {
      return compare >= value.$gte;
    } if (value.$lt !== undefined) {
      return compare < value.$lt;
    } if (value.$lte !== undefined) {
      return compare <= value.$lte;
    } if (typeof (value) === 'number') {
      return compare === value;
    }
  } else if (type === 'tags') {
    switch (value) {
      case 'transform':
        return card.dfc;
      case 'aftermath':
        return card.aftermath;
      default:
        return undefined;
    }
  }
  return undefined;
}

function cardMatchesConditions(conditions: any[], card: Card, and = true): boolean {
  let matchesAnd = true;
  let matchesOr = false;
  conditions.forEach((cond) => {
    const type = Object.keys(cond)[0];
    const value = cond[type];
    if (!cardMatches(type, value, card)) {
      matchesAnd = false;
    } else {
      matchesOr = true;
    }
  });
  return and ? matchesAnd : matchesOr;
}

export function search(query: string): Card[] {
  if (query === undefined) {
    return [];
  }
  try {
    const conditions = parse(query);
    if (conditions === undefined) {
      return [];
    }
    return set.cards.filter((card) => cardMatchesConditions(conditions, card));
  } catch(e: any) {
    return [];
  }
}

export function getCards(): Card[] {
  return set.cards;
}
