import { parse as parseFlags } from "../deps/std/flags.ts";
import { compile, TypeMap } from "../lib/fart.ts";
import cartridges from "./carts/mod.ts";
import typemaps from "./typemaps/mod.ts";

// deno-lint-ignore no-explicit-any
const getTarget = (flags: any): string | undefined => {
  const target = flags.target ?? flags.lang ?? flags.reg;
  const exists = cartridges.has(target);
  if (typeof target === "string" && exists) {
    return target;
  }
  return undefined;
};

// deno-lint-ignore no-explicit-any
const getSource = (flags: any) => {
  const source = flags._[0];
  if (typeof source === "string") return source;
  console.log("Please include a source file.");
  Deno.exit();
};

// deno-lint-ignore no-explicit-any
const getIndentation = (flags: any) => {
  const indent = flags.indent;
  if (typeof indent === "string") return indent;
  return undefined;
};

// deno-lint-ignore no-explicit-any
const getOutput = (flags: any) => {
  const output = flags.output ?? flags.out ?? flags.o;
  if (typeof output === "string") return output;
  return undefined;
};

// deno-lint-ignore no-explicit-any
const getFlags = (flags: any) => ({
  source: getSource(flags),
  target: getTarget(flags),
  indentation: getIndentation(flags),
  help: Boolean(flags.help),
  output: getOutput(flags),
});

if (import.meta.main) {
  const flags = parseFlags(Deno.args);
  const { source, target, indentation, output, help } = getFlags(flags);
  if (help) {
    console.log(`Help coming soon!`);
    Deno.exit(0);
  }
  const content = await Deno.readTextFile(source);
  const cartridge = cartridges.vendor(target);
  if (cartridge === undefined) Deno.exit(1);
  const typemap = typemaps.vendor(target?.split(".").shift());
  if (typemap === undefined) Deno.exit(1);
  const code = compile(content, {
    cartridge,
    typemap,
    indentation,
  });
  if (output !== undefined) {
    await Deno.writeTextFile(output, code);
    Deno.exit(1);
  }
  console.log(code);
}
