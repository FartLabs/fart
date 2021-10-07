import type { Cart, Registry } from "../../lib/fart.ts";

const getTarget = (
  // deno-lint-ignore no-explicit-any
  flags: any,
  registry: Registry<Cart>,
): string | undefined => {
  const target = flags.target ?? flags.lang ?? flags.reg;
  const exists = registry.has(target);
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
export const getFlags = (flags: any, registry: Registry<Cart>) => ({
  source: getSource(flags),
  target: getTarget(flags, registry),
  indentation: getIndentation(flags),
  help: Boolean(flags.help),
  output: getOutput(flags),
});
