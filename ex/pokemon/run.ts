import { Pokeball } from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon.ts";

const great_ball: Pokeball = {
  id: "great",
  used: false,
  catch(p: string) {
    if (this.used) return false;
    this.used = true;
    const caught = Math.random() > 0.5;
    if (caught) {
      console.log(`Caught ${p}!`);
      return true;
    }
    return false;
  },
};

console.log({ great_ball });
