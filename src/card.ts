type CardColor = 'U' | 'W' | 'B' | 'R' | 'G' | 'C' | 'Gld' | 'Lnd';
export type ColorKey = 'White' | 'Blue' | 'Black' | 'Red' | 'Green'
type CardRarity = 'C' | 'U' | 'R' | 'M';
interface CardBack {
  name: string;
  simple_name: string;
  color: string;
  cost: string;
  types: string[];
  typeline: string;
  power: string | number;
  toughness: string | number;
  loyalty: string | number;
  text: string;
  html: string;
  flavor: string;
  artist: string;
  back?: CardBack;
  blob?: string;
}
export interface Card {
  name: string;
  simple_name: string;
  color: CardColor;
  cost: string;
  types: string[];
  typeline: string;
  power: string | number;
  toughness: string | number;
  loyalty: string | number;
  text: string;
  html: string;
  flavor: string;
  artist: string;
  rarity: CardRarity;
  number: number;
  dfc: boolean;
  aftermath: boolean;
  back?: CardBack;
}

const colorMap = {
  White: 'W',
  Blue: 'U',
  Black: 'B',
  Red: 'R',
  Green: 'G',
};

export class CardSet {
  public cards: Card[] = [];

  constructor(data: any) {
    this.cards = Object.keys(data).map((key) => data[key]);
  }

  public static cardHasColor(card: Card, color: ColorKey): boolean {
    return card.color.includes(colorMap[color]);
  }

  public static cardGetCmc(card: Card): number {
    const match = card.cost.match(/\d+/);
    let cmc = 0;
    let index = 0;
    if (match != null) {
      cmc = Number(match[0]);
      index = match.index ?? 0 + match[0].length;
    }
    cmc += card.cost.length - index;
    return cmc;
  }
}
