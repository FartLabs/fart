import { Registry, TypeMap } from "../../lib/fart.ts";

import tsTypeMap from "./typescript.ts";

const base = new Registry<TypeMap>("typemaps");

base.set("ts", tsTypeMap);

export default base;
