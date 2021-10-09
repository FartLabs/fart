import type { Dex as iDex } from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

export class Dex implements iDex {
  constructor(
    public national = {
      25: {
        name: "Pikachu",
        num: 25,
        caught: false,
        summary:
          "This Pokémon has electricity-storing pouches on its cheeks. These appear to become electrically charged during the night while Pikachu sleeps. It occasionally discharges electricity when it is dozy after waking up.",
        types: { type1: "Electric" },
      },
    },
  ) {}

  register(num: number) {
    const { name } = this.national[num];
    if (this.national[num].caught) {
      console.log(`${name} has already been registerd.`);
      return;
    }
    this.national[num].caught = true;
    console.log(`Registered ${name}!`);
  }
}
