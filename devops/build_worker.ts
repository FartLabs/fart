/**
 * Builds the Cloudflare Worker into `dist/`.
 *
 * - `dist/worker.js` is `fart_server/worker.ts` bundled into a single module.
 * - `dist/assets/_repo/` holds `README.md` and `docs/`, which the server
 *   renders at runtime (Workers have no file system).
 *
 * Usage: `deno task build:worker`
 */

import { copy, emptyDir, ensureDir } from "@std/fs";
import { fromFileUrl } from "@std/path";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);

await emptyDir(dist);
// Keep build output out of version control without touching the root ignore.
await Deno.writeTextFile(new URL(".gitignore", dist), "*\n");

const bundle = await new Deno.Command(Deno.execPath(), {
  args: [
    "bundle",
    "--platform=browser",
    `--output=${fromFileUrl(new URL("worker.js", dist))}`,
    fromFileUrl(new URL("fart_server/worker.ts", root)),
  ],
  stdout: "inherit",
  stderr: "inherit",
}).output();
if (!bundle.success) Deno.exit(bundle.code);

const repoAssets = new URL("assets/_repo/", dist);
await ensureDir(repoAssets);
await Deno.copyFile(
  new URL("README.md", root),
  new URL("README.md", repoAssets),
);
await copy(new URL("docs/", root), new URL("docs/", repoAssets), {
  overwrite: true,
});

console.log("Built dist/worker.js and dist/assets/_repo/");
