---
self_link: https://fart.fart.tools/getting-started
---

# Getting Started

Welcome to Fart! This guide will get the Fart infrastructure running on your
machine.

## Prerequisites

Fart runs on
[Deno](https://docs.deno.com/runtime/manual/getting_started/installation).
Install the latest version and make sure `deno` is on your `PATH`.

## Using the library

`transpile` takes Fart source and a code cartridge describing the target
language, and returns the generated code.

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

Each language target is a _cartridge_: an object that defines how Fart's
structures and keywords map onto that language. Passing a cartridge is how you
choose an output language.

## Core concepts

- **Tokenization** maps source syntax onto a list of tokens.
- **Transpilation** walks those tokens and dispatches events that a cartridge
  turns into code.
- **Cartridges** are the language targets, and they own the actual output
  formatting.

## Running the server

The Fart Server renders these docs and exposes the transpiler over HTTP:

```bash
deno run --allow-all fart_server/serve.ts
```

Then open <http://localhost:8080/>. See
[the server architecture](https://fart.fart.tools/server-architecture) for the
full route list.

To compile Fart source hosted in a public GitHub repository, request the `/ts/`
route with the repository path:

```bash
curl https://fart.fart.tools/ts/{owner}/{repo}/{branch}/path/to/source.fart
```

## Running the tests

```bash
deno test --allow-all
```

The server tests spin up a local server and run a real `deno run` against it,
which is why they need `--allow-all`.
