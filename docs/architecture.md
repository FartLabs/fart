---
self_link: https://fart.fart.tools/architecture
---

# Architecture

Fart is split into a library that does the transpiling, a server that exposes it
over HTTP, and the supporting directories around them.

### [`/lib/`](https://github.com/FartLabs/fart/tree/main/lib)

The source of the library. This is the part that other projects import.

- `lib/transpile/` — the transpiler, including the code cartridges that render
  output for each target language
- `lib/proto_parser/` — the protocol buffer parser
- `lib/registry/` — registry item handling
- `lib/fart_error/` — error types
- `lib/constants/` — shared constants

### [`/fart_server/`](https://github.com/FartLabs/fart/tree/main/fart_server)

The HTTP server. Middleware is grouped by feature under `bonus_features/`:

- `compilation/` — turns Fart source into generated code
- `doc_generator/` — renders this documentation
- `shortlinks/` — friendly redirects

See [the server architecture](https://fart.fart.tools/server-architecture) for
how requests are routed.

### [`/docs/`](https://github.com/FartLabs/fart/tree/main/docs)

Fart-related documentation. Everything in this directory is rendered and served
by the Fart Server, one document per top-level route.

### [`/devops/`](https://github.com/FartLabs/fart/tree/main/devops)

Repository maintenance scripts, currently the coverage threshold check that runs
in CI.

### [`/vendor/`](https://github.com/FartLabs/fart/tree/main/vendor)

Vendored third-party parsers. Excluded from Deno's type checking via the
`exclude` key in `deno.json`.
