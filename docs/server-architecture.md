# Fart Server 🛰

To run the server, try

```bash
deno run --allow-net --allow-read --allow-env --unstable std/server/serve_http.ts
```

## Features

### Homepage (`GET /`)

> [/middleware/home.ts](middleware/home.ts)

This page renders and serves the README.md of <https://etok.codes/fart/>.

### Static Files (`GET /[...path].*`)

> [/middleware/static.ts](middleware/static.ts)

This middleware serves static files located under [`/std/server/static/`](/static).

### Compile Farts (`GET /[registry]/[...path].*`)

> [/middleware/compile.ts](middleware/compile.ts)

This middleware serves the compiled result of any Fart source file publicly hosted on GitHub.

```
URL Composition:
================

/[registry]/[author]/[project_name]/[branch]/[...path].*

Examples:
=========

/go/EthanThatOneKid/fart/main/ex/pokemon/mod.go
/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts
/ts.deno/EthanThatOneKid/fart/main/ex/pokemon/mod.ts
/ts.deno.api/EthanThatOneKid/fart/main/ex/pokemon/mod.ts
```

### GitHub Docs (`/[...path]`)

> [/middleware/gh_docs.ts](middleware/gh_docs.ts)

Any markdown files located under [`/docs](../../docs) are rendered and served.
