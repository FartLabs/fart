<img src="std/server/static/fart-logo.png" alt="Fart Logo" style="float: right; width: 144px;">

# Fart 🌫

Program that generates type definitions in multiple languages.

> 🚧 **Beware of Project Status**: _Work-in-Progress_

## Development 👨‍💻

> ℹ **INFO**: `CONTRIBUTING.md` coming soon!!

To execute the Fart tests, simply run `deno test`. If you have not done so already, please [install Deno](https://github.com/denoland/deno_install).

### Give it a Spin

You can give Fart a spin on your machine in one command (assuming Deno is installed).

```bash
deno run --reload https://etok.codes/fart/raw/main/ex/pokemon/run.ts
```

### Commands

- **Upgrade a Dependency**: `deno run --unstable --allow-read --allow-write devops/upgrade_dep.ts -y --verbose --dep=std --v=0.110.0`
- **Run the CLI**: `deno run --allow-read --allow-write std/cli/run.ts ./ex/pokemon/mod.fart --reg=ts --output=./ex/pokemon/mod.out.ts`
- **Spin up Server**: `deno run --allow-net std/server/serve_http.ts`
- **Develop the Server**: `deployctl run --watch std/server/worker.ts`

#### Public Commands

- **Upgrade a Dependency**: `deno run --unstable --allow-read --allow-write https://etok.codes/fart/raw/main/devops/upgrade_dep.ts -y --verbose --dep=std --v=0.110.0`

## Architecture

### `/deps/`

Handles third party dependencies.

### `/devops/`

Stores scripts.

### `/ex/`

Stores example data and code.

### `/lib/`

Stores the source code of the library.

### `/std/`

A place to keep all of the official stuff that people can use alongside Fart.

### Fart CLI

Clone the repository and then try this command:

```bash
deno run --allow-read --allow-write std/cli.ts ./ex/pokemon.fart --reg=ts.deno --output=./ex/pokemon.ts
```

### Fart Server 📡

#### How to spin up a Fart Server

Clone the repository and then try this command:

```bash
deno run --allow-net std/server/serve-http.ts
```

#### Simulating a Deno Deploy Environment

If you haven't already, [install `deployctl`](https://deno.com/deploy/docs/running-scripts-locally), a runtime that simulates [Deno Deploy](https://deno.com/deploy).

```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts
```

To run the development server, enter the below command into your terminal.

```bash
deployctl run --watch std/server/worker.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://github.com/EthanThatOneKid/)
