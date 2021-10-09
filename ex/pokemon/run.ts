// Source Fart: <https://etok.codes/fart/blob/main/ex/pokemon/mod.fart>
import type {
  Bag,
  PC,
} from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";
import { Pokeball } from "./pokeball.ts";
import { Pokemon } from "./pokemon.ts";

const great_ball = new Pokeball("great", 0.5);
const ultra_ball = new Pokeball("ultra", 0.8);
const bag: Bag = { balls: [great_ball, ultra_ball] };
const pc: PC = { mons: [] };

const pikachu: Pokemon = {
  name: "Pikachu",
  types: { type1: "Electric" },
  async catch(ball: Pokeball) {
    const caught = await ball.throw(this.name);
    if (caught) {
      this.ball = ball;
      pc.mons.push(this);
      console.log(`Moved ${this.name} to the PC.`);
    }
    return caught;
  },
};

for (const ball of bag.balls) {
  const caught = await pikachu.catch(ball);
  if (caught) break;
}

console.log("PC: ", pc);
