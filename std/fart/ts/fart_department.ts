import type {
  FartDepartment as fFartDepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/fart/fart.ts";

import { compile } from "../../../lib/compile/mod.ts";

export class FartDepartment implements fFartDepartment {
  constructor(private io: IO) {}
  
  async compile(filepath: string, cartId: string): Promise<string> {
    // TODO:
    // Refer to ../../cli/cli.ts for compilation
    // If the filepath is a valid URL, check the internet instead of filesystem.
      const content = await Deno.readTextFile(source);

      const item = cartridges.vendor(target);
      if (item === undefined) Deno.exit(1);
      const { cartridge, typemap } = item;
      const code = await compile(content, {
        cartridge,
        typemap,
        indentation,
      });
      if (output !== undefined) {
        await Deno.writeTextFile(output, code);
        Deno.exit(1);
      }
      console.log(code);
    };
    
    return filepath + cartId;
  }
}
