// deno-lint-ignore-file
import type {
  IODepartment as fIODepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/io/io.ts";

export class FakeIODepartment implements fIODepartment {
  async readFile(path: string): Promise<string> {
    return path;
  }

  async writeFile(path: string, content: string): Promise<void> {}

  async fetchIfValidURL(url: string): Promise<string> {
    return url;
  }

  async readIfExists(path: string): Promise<string> {
    return path;
  }
}
