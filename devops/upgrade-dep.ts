import { parse as parseFlags } from "../devdeps/std/flags.ts";
import { expandGlob } from "../devdeps/std/fs.ts";

export const upgradeDep = async (
  version: string,
  dependency: string,
) => {
  // Check out https://www.digitalocean.com/community/tools/glob.
  const serializedPattern = `${dependency.replace("/", "\\/")}@?[\\w\\d\.]*\\/`;
  const pattern = new RegExp(serializedPattern, "g");
  for await (const file of expandGlob("./{devdeps,deps}/**/*.ts")) {
    const content = await Deno.readTextFile(file.path);
    // TODO: Create summary detailing which imports were replaced in which files
    // including total amount of replacements made (--verbose=false by default).
    const result = content.replace(pattern, `${dependency}@${version}/`);
    await Deno.writeTextFile(file.path, result);
  }
};

if (import.meta.main) {
  const flags = parseFlags(Deno.args);
  if (flags.help) {
    console.log(`Help coming soon!`);
    Deno.exit();
  }
  const version = flags.version ?? flags.v;
  if (version === undefined) {
    alert('Please set a version (Ex. `--version="0.1.1"`).');
    Deno.exit();
  }
  const dependency = flags.dependency ?? flags.dep ?? "https://deno.land/std";
  if (!flags.y) {
    const consent = confirm(
      `This operation will overwrite all '${dependency}' imports to version '${version}'. Will you proceed?`,
    );
    if (!consent) Deno.exit();
  }
  await upgradeDep(version, dependency);
}
