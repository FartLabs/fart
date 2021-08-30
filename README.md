# Fart 🌫

Program that that generates type definitions in multiple languages.

## Development 👨‍💻

> **INFO**: `CONTRIBUTING.md` coming soon!!

To execute the Fart tests, simply run `deno test`. If you have not done so already, please [install Deno](https://github.com/denoland/deno_install).

### Fart Server 📡

If you haven't already, [install `deployctl`](https://deno.com/deploy/docs/running-scripts-locally), a runtime that simulates [Deno Deploy](https://deno.com/deploy).

```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts
```

To run the development server, enter the below command into your terminal.

```bash
deployctl run --watch ./server.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://github.com/EthanThatOneKid/)
