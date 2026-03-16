import { assertEquals } from "@std/assert";
import { transpile } from "../transpile.ts";
import { generateTypeScriptCartridge } from "./ts_cartridge.ts";

Deno.test("ts_cartridge outputs correctly formatted interfaces", async () => {
  const code = `
    type Example {
      name: string
      age?: number
    }
  `;
  const cart = generateTypeScriptCartridge();
  const tsCode = await transpile(code, cart);
  
  assertEquals(tsCode.includes("export interface Example {"), true);
  assertEquals(tsCode.includes("name: string;"), true);
  assertEquals(tsCode.includes("age?: number;"), true);
});

Deno.test("ts_cartridge omits comments properly", async () => {
  const code = `; A simple user\ntype User { name: string }`;
  const cart = generateTypeScriptCartridge();
  const tsCode = await transpile(code, cart);
  
  assertEquals(tsCode.includes("// A simple user"), true);
  assertEquals(tsCode.includes("export interface User {"), true);
});

Deno.test("ts_cartridge appends default export if implFile is specified", async () => {
  const code = `type Nothing {}`;
  const cart = generateTypeScriptCartridge({ implFile: "path/to/impl.ts" });
  const tsCode = await transpile(code, cart);
  
  assertEquals(tsCode.includes('import Impl from "path/to/impl.ts";'), true);
  assertEquals(tsCode.includes('export default Impl;'), true);
});
