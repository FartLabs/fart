---
self_link: https://fart.tools/server-architecture
---

# Fart Server 📡

## How to spin up a Fart Server

You can spin up the Fart Serer on your machine in one command (assuming Deno is installed). 

```bash
deno run --allow-net --allow-read --allow-env --unstable https://etok.codes/fart/raw/main/std/server/serve_http.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno run --allow-net --allow-read --allow-env --unstable std/server/serve_http.ts
```

</details>

## Simulating a Deno Deploy Environment

If you haven't already, [install `deployctl`](https://deno.com/deploy/docs/running-scripts-locally), a runtime that simulates [Deno Deploy](https://deno.com/deploy).

```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts
```

To run the development server, enter the below command into your terminal.

```bash
deployctl run --watch std/server/worker.ts
```

## Features

### Homepage (`GET /`)

> [/middleware/home.ts](https://etok.codes/fart/blob/main/std/server/middleware/gh_docs.ts)

This page renders and serves the README.md of <https://etok.codes/fart/>.

### Static Files (`GET /[...path].*`)

> [/middleware/static.ts](https://etok.codes/fart/blob/main/std/server/middleware/static.ts)

This middleware serves static files located under [`/std/server/static/`](https://etok.codes/fart/blob/main/std/server/static/).

### GitHub Docs (`/[...path]`)

> [/middleware/gh_docs.ts](https://github.com/EthanThatOneKid/fart/tree/main/std/server/middleware/gh_docs.ts)

Any markdown files located under [`/docs`](https://etok.codes/fart/tree/main/docs/) are rendered and served.

### Compile Farts (`GET /[registry]/[...path].*`)

> [/middleware/compile.ts](https://etok.codes/fart/blob/main/std/server/middleware/compile.ts)

This middleware serves the compiled result of any Fart source file publicly hosted on GitHub.

If no matching public GitHub source Farts can be found, the request checks to see if there is any raw Fart code in the body.
If so, the server will generate the code based on the source Fart from the request body.

#### URL Composition

This is a more detailed diagram of the pattern that the compilation middlware snags on.

```
/[registry]/[owner]/[project_name]/[branch]/[...path].*
```

#### Compilation Endpoint Examples

- `/go/EthanThatOneKid/fart/main/ex/pokemon/mod.go`
- `/ts/EthanThatOneKid/fart/main/ex/pokemon/mod.ts`
- `/ts.deno/EthanThatOneKid/fart/main/ex/pokemon/mod.ts`
- `/ts.deno.api/EthanThatOneKid/fart/main/ex/pokemon/mod.ts`
- `/html.highlight/EthanThatOneKid/fart/main/ex/pokemon/mod.html`
