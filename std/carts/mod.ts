import { Registry } from "../../lib/fart.ts";
import type { Cart } from "../../lib/gen/cart.ts";

import denoCart from "./deno.cart.ts";
// import denoApiCart from "./deno.api.cart.ts";
// import goCart from "./go.cart.ts";

const base = new Registry<Cart>("cartridges");

// TODO: Add ts.node.*
// TODO: Add remaining go.*
base.set("ts", denoCart);
base.set("ts.deno", denoCart);
// base.set("ts.deno.api", denoApiCart);
// base.set("go", goCart);

export default base;
