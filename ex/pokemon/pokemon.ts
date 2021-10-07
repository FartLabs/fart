export interface Pokeball {
  id: string;
  used: boolean;
  catch: (input: string) => boolean;
}
export interface Pokemon {
  name: string;
  ball?: Pokeball;
  types: {
    type1: string;
    type2?: string;
  }
  obtain: (input: Pokeball) => void;
}