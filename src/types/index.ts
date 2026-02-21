export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface TypeDef {
  name: PokemonType;
  label: string;
  color: string;
}

export interface TypeEffectiveness {
  weaknesses: PokemonType[]; // Damage received x2 or x4
  resistances: PokemonType[]; // Damage received x0.5 or x0.25
  immunities: PokemonType[]; // Damage received x0
  superEffective: PokemonType[]; // Deals damage x2
  notVeryEffective: PokemonType[]; // Deals damage x0.5
  noEffect: PokemonType[]; // Deals damage x0
}

export interface TypeMatchup {
  multiplier: number;
}
