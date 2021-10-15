---
self_link: https://fart.tools/pokemon-example
---

# Pokémon Fart Example

This example runs on two files: a type declaration file, [`mod.fart`](https://etok.codes/fart/blob/main/ex/pokemon/mod.fart), and an implementation file, [`run.ts`](https://etok.codes/fart/blob/main/ex/pokemon/run.ts).

```bash
deno run --reload https://etok.codes/fart/raw/main/ex/pokemon/run.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno run --reload ex/pokemon/run.ts
```

</details>

## Example Code

### [`/ex/pokemon/mod.fart`](https://etok.codes/fart/blob/main/ex/pokemon/mod.fart)

```fart
type Pokeball {
  id*: string
  odds*: number
  used*: boolean

  throw*: fn % <string, async % boolean>
}

type Pokemon {
  name*: string
  num*: number
  ball: Pokeball
  
  catch*: fn % <Pokeball, async % boolean>
}

type PC {
  mons*: array % Pokemon
}

type DexEntry {
  name*: string
  num*: number
  summary*: string
  caught*: boolean
  types*: { type1*: string
            type2:  string } 
}

type Dex {
  national*: dict % <number, DexEntry>
  register*: fn % <number, _>
}

type Bag {
  dex*: Dex
  balls*: array % Pokeball
}
```

### [`/ex/pokemon/run.ts`](https://etok.codes/fart/blob/main/ex/pokemon/run.ts)

```ts
// Source Fart: <https://etok.codes/fart/blob/main/ex/pokemon/mod.fart>
import type {
  Bag,
  PC,
  Pokemon,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

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
```

## Expected Stdout

![Pokemon Example Stdout](https://github.com/EthanThatOneKid/fart/blob/main/std/server/static/pokemon-example-stdout.png?raw=true)
