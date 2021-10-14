import { parse as parseFlags } from "../../deps/std/flags.ts";
import { compile } from "../../lib/fart.ts";
import { getFlags } from "./common.ts";
import cartridges from "../carts/mod.ts";

export const cli = async (args: string[]) => {
  const flags = parseFlags(args);
  const { source, target, indentation, output, help } = getFlags(
    flags,
    cartridges,
  );
  if (help) {
    console.log(`Help coming soon!`);
    Deno.exit(0);
  }
  const content = await Deno.readTextFile(source);
  const item = cartridges.vendor(target);
  if (item === undefined) Deno.exit(1);
  const { cartridge, typemap } = item;
  const code = await compile(content, {
    cartridge,
    typemap,
    indentation,
  });
  if (output !== undefined) {
    await Deno.writeTextFile(output, code);
    Deno.exit(1);
  }
  console.log(code);
};
