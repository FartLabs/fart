import { Registry } from "../../lib/fart.ts";
import type { Cart } from "../../lib/gen/cart.ts";
import type { TypeMap } from "../../lib/gen/typemap.ts";
import tsTypeMap from "../typemaps/typescript.ts";
import { Mime } from "../common.ts";

import denoCart from "./deno.cart.ts";
// import denoApiCart from "./deno.api.cart.ts";
// import goCart from "./go.cart.ts";

const base = new Registry<{
  cartridge: Cart;
  typemap: TypeMap;
  mimetype: Mime;
}>("cartridges");

// TODO: Add ts.node.*
// TODO: Add remaining go.*

base.set("ts", {
  cartridge: denoCart,
  typemap: tsTypeMap,
  mimetype: Mime.TypeScript,
});

base.set("ts.deno", {
  cartridge: denoCart,
  typemap: tsTypeMap,
  mimetype: Mime.TypeScript,
});

export default base;
