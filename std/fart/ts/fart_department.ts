import type {
  CompilerSettings,
  FartDepartment as fFartDepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/fart/fart.ts";
import { IODepartment as fIODepartment } from "https://fart.deno.dev/ts/EthanThatOneKid/fart/main/std/io/io.ts";

import { compile } from "../../../lib/fart.ts";
import cartridges from "../../carts/mod.ts";

export class FartDepartment implements fFartDepartment {
  constructor(private io: fIODepartment) {}

  async compile(settings: CompilerSettings): Promise<string> {
    // deno-lint-ignore camelcase
    const { filepath, cartridge_id } = settings;
    console.log({ settings });
    const content = await this.io.readFile(filepath);
    const item = cartridges.vendor(cartridge_id);
    if (item === undefined) return "";
    const { cartridge, typemap } = item;
    const code = await compile(content, {
      cartridge,
      typemap,
    });
    return code;
  }
}
