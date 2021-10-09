import type { Pokeball as iPokeball } from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Pokeball implements iPokeball {
  constructor(
    public id: string,
    public odds: number,
    public used: boolean = false,
  ) {}

  async throw(name: string): Promise<boolean> {
    if (this.used) return false;
    const caught = Math.random() > (1 - this.odds);
    console.log("wiggle");
    await sleep(1e3);
    console.log("wiggle");
    await sleep(1e3);
    if (caught) {
      console.log(`Caught ${name}`);
      return true;
    }
    console.log(`${name} broke out!`);
    return false;
  }
}
