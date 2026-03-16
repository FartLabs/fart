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

You can give Fart a spin on your machine in one command (assuming Deno is
installed). Check out the example code on
<https://fart.fart.tools/pokemon-example/>.

```bash
deno run --reload https://github.com/EthanThatOneKid/fart/raw/main/ex/pokemon/run.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno run --reload ex/pokemon/run.ts
```

</details>

### Fart CLI

Try running the command below after cloning the repository.

```bash
deno run --allow-read --allow-write std/cli/run.ts ./ex/pokemon.fart --reg=ts.deno --output=./ex/pokemon.ts
```

### Fart Server 📡

Please refer to
[docs/server-architecture.md](https://github.com/EthanThatOneKid/fart/blob/main/docs/server-architecture.md#readme)
to learn about how the server code is organized.

## Architecture

Please refer to
[docs/architecture.md](https://github.com/EthanThatOneKid/fart/blob/main/docs/architecture.md#readme)
to learn about the structure of this repository.

## Closed loop

This project is built with the ambition of forming a closed-loop execution
substrate for autonomous coding agents. Fart is designed as a structural
foundation that perfectly complements [GEPA (Genetic-Pareto)](https://github.com/gepa-ai/gepa)'s
unique strengths in reflective, evolutionary search.

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
