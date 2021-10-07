// Imports in this file must be manually upgraded since this operation is able
// to overwrite this script's dependencies.
import { parse as parseFlags } from "https://deno.land/std@0.106.0/flags/mod.ts";
import { expandGlob } from "https://deno.land/std@0.106.0/fs/mod.ts";

export const upgradeDep = async (
  version: string,
  dependency: string,
  logging: "verbose" | "silent" = "silent",
) => {
  // Check out https://www.digitalocean.com/community/tools/glob.
  const serializedPattern = `${dependency.replace("/", "\\/")}@?[\\w\\d\.]*\\/`;
  const pattern = new RegExp(serializedPattern, "g");
  for await (const file of expandGlob("./deps/**/*.ts")) {
    const content = await Deno.readTextFile(file.path);
    let replacementCount = 0;
    const result = content.replace(
      pattern,
      (match) => {
        const replacement = `${dependency}@${version}/`;
        if (match !== replacement) replacementCount++;
        return replacement;
      },
    );
    if (content !== result && replacementCount > 0) {
      await Deno.writeTextFile(file.path, result);
      if (logging === "verbose") {
        const plural = replacementCount !== 1;
        const formattedCount = `${replacementCount}`.padStart(3, "0");
        const formattedUnit = `import${plural ? "s" : ""}`.padEnd(7);
        const formattedReplacementCount = `${formattedCount} ${formattedUnit}`;
        const message =
          `Upgraded ${formattedReplacementCount} to '${version}' in '${file.path}'`;
        console.log(message);
      }
    }
  }
};

const getFlags = (args: string[]) => {
  const flags = parseFlags(args);
  if (flags.help) {
    console.log(`Help coming soon!`);
    Deno.exit();
  }
  const version = flags.version ?? flags.v;
  if (version === undefined) {
    alert('Please set a version (Ex. `--version="0.1.1"`).');
    Deno.exit();
  }
  const dependency: string = flags.dependency ?? flags.dep ??
    "https://deno.land/std";
  const preconsented = Boolean(flags.y);
  const verboseLogging = Boolean(flags.verbose);
  return { version: String(version), dependency, preconsented, verboseLogging };
};

if (import.meta.main) {
  const { version, dependency, preconsented, verboseLogging } = getFlags(
    Deno.args,
  );
  if (!preconsented) {
    const consent = confirm(
      `This operation will overwrite all '${dependency}' imports to version '${version}'. Will you proceed?`,
    );
    if (!consent) Deno.exit();
  }
  await upgradeDep(version, dependency, verboseLogging ? "verbose" : "silent");
}
