---
self_link: https://fart.fart.tools/server-architecture
---

# Fart Server 📡

The Fart Server turns the Fart repository into a website. It renders the docs in
this directory, serves the compilation routes, and answers a few shortlinks.

## Running it locally

```bash
deno run --allow-all fart_server/serve.ts
```

Then open <http://localhost:8080/>. The port can be overridden with the `PORT`
environment variable.

The server has no build step and no dependencies beyond the ones declared in
`deno.json`.

## Request handling

Requests flow through an ordered list of middleware in
[`fart_server/serve.ts`](https://github.com/FartLabs/fart/blob/main/fart_server/serve.ts).
Each middleware receives the `Request` and returns a `Response` or `null` to
decline and let the next one try. The first non-`null` response wins; if every
middleware declines, the server answers `404`.

The chain is registered once by `setup()` and stored in memory, so the order
below is the real precedence:

| # | Middleware                     | Source                                    |
| - | ------------------------------ | ----------------------------------------- |
| 1 | Compile Fart source            | `bonus_features/compilation/compile.ts`   |
| 2 | Shortlink redirects            | `bonus_features/shortlinks/shortlinks.ts` |
| 3 | `GET /debug/size`              | `serve.ts`                                |
| 4 | `GET /debug/deployment`        | `serve.ts`                                |
| 5 | Render the README at `/`       | `bonus_features/doc_generator/docs.ts`    |
| 6 | Render a document at `/{slug}` | `bonus_features/doc_generator/docs.ts`    |

Because the docs routes are last and only claim a path when a matching file
exists, they never shadow the compilation or shortlink routes.

## Routes

### Documentation

| Route          | Serves                      |
| -------------- | --------------------------- |
| `GET /`        | `README.md`, rendered       |
| `GET /{slug}`  | `docs/{slug}.md`, rendered  |
| `GET /{slug}/` | same, with a trailing slash |

Slugs are single path segments matching `[a-z0-9][a-z0-9-]*`, so the current
documents are reachable at `/architecture`, `/getting-started`, `/type-example`,
and `/server-architecture`. Any other path is left for the later middleware.

Documents are read from the deployment bundle relative to `import.meta.url`, so
the same code works from a checkout and from a Deno Deploy deployment.

### Rendering

`marked` turns the Markdown into HTML, wrapped in a small page shell. Before
rendering, two transformations run — see
[`doc_generator/links.ts`](https://github.com/FartLabs/fart/blob/main/fart_server/bonus_features/doc_generator/links.ts):

- **Front matter is stripped.** The `---` block at the top of each document
  holds `self_link` metadata for the old server, which would otherwise render as
  visible text.
- **Links are rewritten.** Links to this repository's own `README.md` and
  `docs/*.md` become server routes, so a document that links to another document
  stays on the server. Both `FartLabs/fart` and the legacy
  `EthanThatOneKid/fart` count as this repository, because the moved
  repository's URLs still redirect. `?raw=true` blob URLs are promoted to
  `raw.githubusercontent.com`. Links to files with no server route, foreign
  repositories, non-default branches, anchors, and already-relative links are
  left exactly as authored.

### Compilation

| Route                                                | Returns                        |
| ---------------------------------------------------- | ------------------------------ |
| `GET /ts/{owner}/{repo}/{branch}/{path}`             | generated TypeScript           |
| `GET /deno.cli/{owner}/{repo}/{branch}/{path}`       | same, for Deno CLI             |
| `GET /html.syntax.gh/{owner}/{repo}/{branch}/{path}` | GitHub-style HTML highlighting |

The path after the prefix is a `raw.githubusercontent.com` path, so the server
compiles Fart source hosted in any public GitHub repository, not just this one.

An implementation file can be mapped onto a Fart source by appending it after a
`~`:

```
/ts/{owner}/{repo}/{branch}/path/to/source.fart~path/to/impl.ts
```

Responses carry `Access-Control-Allow-Origin: *` so Deno's remote module loader
can import them directly.

> ⚠️ **Note:** no `.fart` files are currently committed to this repository, so
> these routes only produce output for Fart source hosted elsewhere.

### Shortlinks

Defined in
[`shortlinks.json`](https://github.com/FartLabs/fart/blob/main/fart_server/bonus_features/shortlinks/shortlinks.json)
and matched as path prefixes, with the remainder of the path and the query
string appended to the destination:

| Path      | Redirects to             |
| --------- | ------------------------ |
| `/github` | the repository on GitHub |
| `/design` | the design document      |
| `/author` | the author's site        |

### Debug

| Route                   | Returns                                      |
| ----------------------- | -------------------------------------------- |
| `GET /debug/size`       | the number of registered middleware handlers |
| `GET /debug/deployment` | the current Deno deployment ID, if any       |

## Deploying

The server exports a `Deno.ServeDefaultExport` (`export default { fetch }`), so
it deploys to [Deno Deploy](https://deno.com/deploy) with `fart_server/serve.ts`
as the entrypoint. `import.meta.main` guards the local `Deno.serve` path, so the
same file works in both places.

The server requires **no environment variables**. The `DENO_DEPLOY_PROJECT_NAME`
and `DENO_DEPLOY_ACCESS_TOKEN` variables that configured the removed Deno Deploy
Classic version redirects are gone; see
[#45](https://github.com/FartLabs/fart/pull/45).

> ⚠️ `fart.fart.tools` is still pointed at the retired Deno Deploy Classic
> infrastructure. The migration is tracked in
> [#39](https://github.com/FartLabs/fart/issues/39) and needs DNS changes that
> must be made by hand.

## Tests

```bash
deno test --allow-all fart_server
```

The compilation tests spin up a local server and run a real `deno run` against
it, which is why they need `--allow-all`. The doc and link tests are pure and
need no network access.
