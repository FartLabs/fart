import type {
  FartDepartment as fFartDepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/fart/fart.ts";

// import { compile } from "../../../lib/compile/mod.ts";

export class FartDepartment implements fFartDepartment {
  async compile(filepath: string, cartId: string): Promise<string> {
    // TODO:
    // Refer to ../../cli/cli.ts for compilation
    // If the filepath is a valid URL, check the internet instead of filesystem.
    return filepath + cartId;
  }
}
