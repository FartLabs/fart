import type { Pokeball, Pokemon } from "fart/pokemon.ts";

class UltraBall implements Pokeball {
  id = "ultra";
  used = false;
  catch(name: string): boolean {
    if (this.used) return false;
    this.used = true;
    const caught = Math.random() > 0.5;
    if (caught) {
      console.log(`${name} was caught!`);
      return true;
    }
    console.log(`${name} got away...`);
    return false;
  }
}

class Pikachu implements Pokemon {
  name = "Pikachu";
  ball: Pokeball | undefined = undefined;
  types = { type1: "Electric" };
  obtain(ball: Pokeball) {
    this.ball = ball;
  }
}

const bag = [
  new UltraBall(),
  new UltraBall(),
  new UltraBall(),
];

const wildPikachu = new Pikachu();

for (const ball of bag) {
  if (ball.catch(wildPikachu.name)) {
    wildPikachu.obtain(ball);
    break;
  }
}
