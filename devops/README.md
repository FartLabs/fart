# DevOps 👨‍💻

## Upgrade Dependencies 🔼

To upgrade a dependency, run the following command:

```bash
# $YOUR_DEP="https://deno.land/std" # Will always upgrade "https://deno.land/std" by default.
# $YOUR_VERSION="0.106.0" # Will exit prematurely if version is left unspecified.
# To run locally: deno run --unstable --allow-read --allow-write devops/upgrade-dep.ts -y --dep=$YOUR_DEP --v=$YOUR_VERSION
deno run --unstable --allow-read --allow-write https://github.com/EthanThatOneKid/fart/raw/main/devops/upgrade-dep.ts -y --dep=$YOUR_DEP --v=$YOUR_VERSION
```

For more information, use the `--help` flag.

---

Created with 💖 by [**@EthanThatOneKid**](https://github.com/EthanThatOneKid/)
