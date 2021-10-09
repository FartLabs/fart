// Source Fart: <https://etok.codes/fart/blob/main/ex/pokemon/mod.fart>
import {
  Bag,
  PC,
  Pokeball,
  Pokemon,
} from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

const great_ball: Pokeball = {
  id: "great",
  used: false,
  async throw(p: string): Promise<boolean> {
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

const ultra_ball: Pokeball = {
  id: "ultra",
  used: false,
  async throw(p: string): Promise<boolean> {
    if (this.used) return false;
    this.used = true;
    const caught = Math.random() > 0.2;
    if (caught) {
      console.log(`Caught ${p}!`);
      return true;
    }
    return false;
  },
};

const bag: Bag = { balls: [great_ball, ultra_ball] };

const pc: PC = { mons: [] };

const pikachu: Pokemon = {
  name: "Pikachu",
  types: { type1: "Electric" },
  async obtain(ball: Pokeball): Promise<boolean> {
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
  const caught = await pikachu.obtain(ball);
  if (caught) break;
}

console.log("PC: ", pc);
