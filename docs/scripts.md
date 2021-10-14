# Project Scripts

- **Upgrade a Dependency**: `deno run --unstable --allow-read --allow-write devops/upgrade_dep.ts -y --verbose --dep=std --v=0.110.0`
- **Run the CLI**: `deno run --allow-read --allow-write std/cli/run.ts ./ex/pokemon/mod.fart --reg=ts --output=./ex/pokemon/mod.out.ts`
- **Spin up Server**: `deno run --allow-net --allow-read --allow-env --unstable std/server/serve_http.ts`
- **Develop the Server**: `deployctl run --watch std/server/worker.ts`
