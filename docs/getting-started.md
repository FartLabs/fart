---
self_link: https://fart.tools/getting-started
---

# Getting Started

> TODO: Write the getting started docs!
> Fart deserves better!

> Curious reader, visit <https://fart.tools/getting-started/>.

## Project Scripts

- **Upgrade a Dependency**: `deno run --unstable --allow-read --allow-write devops/upgrade_dep.ts -y --verbose --dep=std --v=0.116.0`
- **Run the CLI**: `deno run --allow-read --allow-write fart_cli/run.ts ./ex/pokemon/mod.fart --reg=ts --output=./ex/pokemon/mod.out.ts`
- **Spin up Server**: `deno run --allow-net --allow-read --allow-env --unstable fart_server/serve_http.ts`
- **Develop the Server**: `deployctl run --watch fart_server/worker.ts`
