import { Registry } from "../../lib/fart.ts";
import type { Cart } from "../../lib/gen/cart.ts";

import denoCart from "./deno.cart.ts";
import denoServiceCart from "./deno-service.cart.ts";
import goCart from "./go.cart.ts";

const base = new Registry<Cart>("cartridges");

base.set("ts", denoCart);
base.set("ts.deno", denoCart);
base.set("ts.deno.service", denoServiceCart);
base.set("go", goCart);

export default base;
