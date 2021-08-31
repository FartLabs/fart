import { parse as parseFlags } from "./devdeps/std/flags.ts";
import type { TypeMap } from "./lib/typemaps.ts";
import { compile, LanguageTarget } from "./mod.ts";

// deno-lint-ignore no-explicit-any
const getTarget = (flags: any): LanguageTarget | undefined => {
  const target = flags.target ?? flags.lang;
  const exists = Object.values(LanguageTarget).includes(
    target as LanguageTarget,
  );
  if (typeof target === "string" && exists) {
    return target as LanguageTarget;
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
const getTypeMap = (flags: any) => {
  try {
    return JSON.parse(flags.types) as TypeMap;
    // deno-lint-ignore no-empty
  } catch {}
  return undefined;
};

// deno-lint-ignore no-explicit-any
const getIndentation = (flags: any) => {
  const indent = flags.indent;
  if (typeof indent === "string") return indent;
  return undefined;
};

// deno-lint-ignore no-explicit-any
const getFlags = (flags: any) => ({
  source: getSource(flags),
  target: getTarget(flags),
  typemap: getTypeMap(flags),
  indentation: getIndentation(flags),
  help: Boolean(flags.help),
});

if (import.meta.main) {
  const flags = parseFlags(Deno.args);
  const { source, target, typemap, indentation, help } = getFlags(flags);
  if (help) {
    console.log(`Help coming soon!`);
    Deno.exit();
  }
  const content = await Deno.readTextFile(source);
  const code = compile(content, {
    target,
    typemap,
    indentation,
  });
  console.log(code);
}
