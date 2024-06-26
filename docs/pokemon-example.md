---
self_link: https://fart.fart.tools/pokemon-example
---

# Pokémon Fart Example

This example runs on two files: a type declaration file, [`mod.fart`](https://etok.codes/fart/blob/main/ex/pokemon/mod.fart), and an implementation file, [`run.ts`](https://etok.codes/fart/blob/main/ex/pokemon/run.ts).

## Running it Yourself

```bash
deno run --reload https://etok.codes/fart/raw/main/ex/pokemon/run.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno run --reload ex/pokemon/run.ts
```

</details>

## Example code

### [`/ex/pokemon/mod.fart`](https://etok.codes/fart/blob/main/ex/pokemon/mod.fart)

This file contains the schematics that determine the behavior and the shape of the state of the example program.
By passing the pathname of this file into the Fart Server, the Fart Server will respond with the generated code.

Below is a side-by-side representation of Fart => TypeScript.

```fart
; START OF SOURCE FART        ; START OF GENERATED TYPESCRIPT

type Pokeball {               ; interface Pokeball {
  id*: string                 ;   id: string;
  odds*: number               ;   odds: number;
  used*: boolean              ;   used: boolean;

  throw*: fn % <              ;   throw:
    string,                   ;     (pokemon_name: string)
    async % boolean,          ;       => Promise<boolean>;
  >                           ;
}                             ; }

type Pokemon {                ; interface Pokemon {
  name*: string               ;   name: string;
  num*: number                ;   num: number;
  ball: Pokeball              ;   ball?: Pokeball;

  catch*: fn % <              ;   catch:
    Pokeball,                 ;     (ball: Pokeball)
    async % boolean,          ;       => Promise<boolean>;
  >                           ;
}                             ; }

type PC {                     ; interface PC {
  mons*: array % Pokemon      ;   mons: Array<Pokemon>;
}                             ; }

type DexEntry {               ; interface DexEntry {
  name*: string               ;   name: string;
  num*: number                ;   num: number;
  summary*: string            ;   summary: string;
  caught*: boolean            ;   caught: boolean;
  types*: { type1*: string    ;   types: { type1:  string,
            type2:  string }  ;            type2?: string, }
}                             ; }

type Dex {                    ; interface Dex {
  national*: dict % <         ;   national: Record<
    number,                   ;     number,
    DexEntry,                 ;     DexEntry,
  >                           ;   >;
  register*: fn % <           ;   register:
    number,                   ;     (num: number)
    _,                        ;       => void;
  >                           ;
}                             ; }

type Bag {                    ; interface Bag {
  dex*: Dex                   ;   dex: Dex;
  balls*: array % Pokeball    ;   balls: Array<Pokeball>;
}                             ; }

; END OF SOURCE FART          ; END OF GENERATED TYPESCRIPT
```

### [`/ex/pokemon/run.ts`](https://etok.codes/fart/blob/main/ex/pokemon/run.ts)

This file depends on the TypeScript code generated by the Fart Server from the `mod.fart` source fart, fetched from `https://fart.fart.tools/ts/ethanthatonekid/fart/main/ex/pokemon/mod.ts`.
This example uses the types generated by the source fart, `mod.fart`, to make a simple Deno program.
The [`pokeball.ts`](https://etok.codes/fart/blob/main/ex/pokemon/pokeball.ts) and [`dex.ts`](https://etok.codes/fart/blob/main/ex/pokemon/dex.ts) files show how Fart types can be naturally extended in TypeScript.

```ts
// Source Fart: https://etok.codes/fart/blob/main/ex/pokemon/mod.fart
import type {
  Bag,
  PC,
  Pokemon,
} from "https://fart.fart.tools/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

// Extended Pokeball class
// Source: https://etok.codes/fart/blob/main/ex/pokemon/pokeball.ts
import { Pokeball } from "./pokeball.ts";

// Extended Dex class
// Source: https://etok.codes/fart/blob/main/ex/pokemon/dex.ts
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
