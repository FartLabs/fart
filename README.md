# Fart 🌫

Program that generates type definitions, libraries, and programs in multiple languages.

> 🚧 **Beware of Project Status**: _Work-in-Progress_

## Development 👨‍💻

> ℹ **INFO**: `CONTRIBUTING.md` coming soon!!

To execute the Fart tests, simply run `deno test`. If you have not done so already, please [install Deno](https://github.com/denoland/deno_install).

### Give it a Spin

You can give Fart a spin on your machine in one command (assuming Deno is installed).

```bash
deno run --reload https://etok.codes/fart/raw/main/ex/pokemon/run.ts
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
deno run --reload --allow-read --allow-write https://etok.codes/fart/raw/main/std/cli/run.ts ./ex/pokemon/mod.fart --reg=ts --output=./ex/pokemon/mod.out.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno run --allow-read --allow-write std/cli.ts ./ex/pokemon.fart --reg=ts.deno --output=./ex/pokemon.ts
```

</details>

### Fart Server 📡

Please refer to [docs/server-architecture.md](docs/server-architecture.md) to learn about how the server code is organized.

## Architecture

Please refer to [docs/architecture.md](docs/ARCHITECTURE.md) to learn about the structure of this repository.

---

Created with 💖 by [**@EthanThatOneKid**](https://github.com/EthanThatOneKid/)
