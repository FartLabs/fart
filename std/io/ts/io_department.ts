import type {
  IODepartment as fIODepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/io/io.ts";

export class IODepartment implements fIODepartment {
  async fetchIfValidURL(path: string): Promise<string> {
    try {
      const url = new URL(path);
      const response = await fetch(url);
      if (response.status === 200) {
        return await response.text();
      }
      // deno-lint-ignore no-empty
    } catch {}
    return "";
  }

  async readIfExists(path: string): Promise<string> {
    try {
      return await Deno.readTextFile(path);
      // deno-lint-ignore no-empty
    } catch {}
    return "";
  }

  async readFile(path: string): Promise<string> {
    const fetchedFile = await this.fetchIfValidURL(path);
    return fetchedFile.length > 0 ? fetchedFile : await this.readIfExists(path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await Deno.writeTextFile(path, content);
  }
}
