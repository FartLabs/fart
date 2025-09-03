# Fart 🌫

Program that generates type definitions, libraries, and programs in multiple
languages.

## Development 👨‍💻

> ℹ **INFO**: `docs/contributing.md` coming soon!!

To execute the Fart tests, simply run `deno test`. If you have not done so
already, please [install Deno](https://github.com/denoland/deno_install).

### Give it a Spin

You can give Fart a spin on your machine in one command (assuming Deno is
installed). Check out the example code on
<https://fart.fart.tools/pokemon-example/>.

```bash
deno -r https://etok.codes/fart/raw/main/ex/pokemon/run.ts
```

<details>
  <summary>Local Variation</summary>

```bash
deno -r ex/pokemon/run.ts
```

</details>

### Fart CLI

Try running the command below after cloning the repository.

```bash
deno -r --allow-read --allow-write std/cli/run.ts ./ex/pokemon.fart --reg=ts.deno --output=./ex/pokemon.ts
```

### Fart Server 📡

Please refer to
[docs/server-architecture.md](https://etok.codes/fart/blob/main/docs/server-architecture.md#readme)
to learn about how the server code is organized.

## Architecture

Please refer to
[docs/architecture.md](https://etok.codes/fart/blob/main/docs/architecture.md#readme)
to learn about the structure of this repository.

---

Created with 💖 by [**@FartLabs**](https://github.com/FartLabs)
