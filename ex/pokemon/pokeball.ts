import type { Pokeball as iPokeball } from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts";
import { odds, sleep } from "./common.ts";

export class Pokeball implements iPokeball {
  constructor(
    public id: string,
    public odds: number, // Undefined properties can be implemented as needed.
    public used: boolean = false,
  ) {}

  async throw(name: string): Promise<boolean> {
    if (this.used) return false;
    const caught = odds(this.odds);
    await this.wiggle();
    if (caught) {
      console.log(`Caught ${name}`);
      return true;
    }
    console.log(`${name} broke out!`);
    return false;
  }

  // Undefined methods can be implemented as needed.
  async wiggle() {
    console.log("wiggle");
    await sleep(1e3);
    console.log("wiggle");
    await sleep(1e3);
  }
}
