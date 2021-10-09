// Generated by Fart © 2021
export interface Pokeball {
  id: string;
  used: boolean;
  catch: string;
}
export interface Pokemon {
  name: string;
  ball?: Pokeball;
  types: {
    type1: string;
    type2?: string;
  }
  obtain: (input: Pokeball) => Promise<boolean>;
}
export interface PC {
  mons: Array<Pokemon>;
}
// Generated by Fart © 2021
