---
self_link: https://fart.fart.tools/
---

# Fart 🌫

Program that generates type definitions, libraries, and programs in multiple
languages.

> 🚧 **Beware of Project Status**: _Work-in-Progress_

## Development 👨‍💻

> ℹ **INFO**: `docs/contributing.md` coming soon!!

To execute the Fart tests, simply run `deno test`. If you have not done so
already, please [install Deno](https://github.com/denoland/deno_install).

### Give it a Spin

`transpile` turns Fart source into generated code for a target language. Try it
after cloning the repository:

```ts
import { transpile } from "./lib/transpile/mod.ts";
import { generateTypeScriptCartridge } from "./lib/transpile/cartridge/ts_cartridge.ts";

const typescript = await transpile(
  `type User {
  id: string
  name: string
  age?: number
}`,
  { codeCartridge: generateTypeScriptCartridge() },
);
```

See
[docs/getting-started.md](https://github.com/FartLabs/fart/blob/main/docs/getting-started.md)
for a fuller walkthrough.

### Fart Server 📡

The server renders the docs in
[`docs/`](https://github.com/FartLabs/fart/tree/main/docs) and exposes the
transpiler over HTTP. Run it locally with:

```bash
deno run --allow-all fart_server/serve.ts
```

Please refer to
[docs/server-architecture.md](https://github.com/FartLabs/fart/blob/main/docs/server-architecture.md)
to learn about how the server code is organized and which routes it serves.

## Architecture

Please refer to
[docs/architecture.md](https://github.com/FartLabs/fart/blob/main/docs/architecture.md)
to learn about the structure of this repository.

## Closed loop

This project is built with the ambition of forming a closed-loop execution
substrate for autonomous coding agents, enabling recursive, self-referential
spontaneous software. Fart is designed as a structural foundation that perfectly
complements [GEPA (Genetic-Pareto)](https://github.com/gepa-ai/gepa)'s unique
strengths in reflective, evolutionary search.

By combining dynamic HTTP-based transpilation with native remote module
resolution (Deno's HTTP imports), Fart enables:

- **JIT Epistemologies**: Agents are not bound by static schemas. Upon
  encountering a novel domain, an agent can dynamically invent a new `.fart`
  schema and immediately evaluate it via `await import("http://...",)`.
- **Zero-Friction Evaluation**: Changing application logic traditionally
  requires file I/O, build steps, and process restarts. Fart eliminates this,
  providing sub-second code generation and evaluation for extremely fast
  feedback loops.
- **Type-Driven Reflection**: Instead of mutating raw code that often results in
  syntax errors, frameworks like GEPA can mutate the highly-structured `.fart`
  schema. If the schema is invalid, Deno throws native TypeScript compiler
  errors _at import time_, which the optimization engine can ingest to
  reflectively evolve and fix the structure.

---

Created with 💖 by [**@EthanThatOneKid**](https://github.com/EthanThatOneKid/)
