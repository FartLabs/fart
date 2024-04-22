// Source Fart: <https://etok.codes/fart/blob/main/ex/pokemon/mod.fart>
import type {
  Bag,
  PC,
  Pokemon,
} from "https://fart.fart.tools/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

// Extended Pokeball class
import { Pokeball } from "./pokeball.ts";

// Extended Dex class
import { Dex } from "./dex.ts";

// Your stuff
const dex = new Dex();
const great_ball = new Pokeball("great", 0.5);
const ultra_ball = new Pokeball("ultra", 0.8);
const bag: Bag = { dex, balls: [great_ball, ultra_ball] };
const pc: PC = { mons: [] };

// A wild Pikachu
const pikachu: Pokemon = {
  name: "Pikachu",
  num: 25,
  async catch(ball: Pokeball) {
    const caught = await ball.throw(this.name);
    if (caught) {
      this.ball = ball;
      bag.dex.register(this.num);
      pc.mons.push(this);
      console.log(`Moved ${this.name} to the PC.`);
    }
    return caught;
  },
};

// Try to catch it
for (const ball of bag.balls) {
  const caught = await pikachu.catch(ball);
  if (caught) break;
}

// Check the PC
console.log("PC: ", pc);
