import type {
  IODepartment as fIODepartment,
} from "https://fart.tools/ts/EthanThatOneKid/fart/main/std/io/io.ts";

const fetchIfValidURL = async (path: string): Promise<string | undefined> => {
  try {
    const url = new URL(path);
    const response = await fetch(url);
    if (response.status === 200) {
      return await response.text();
    }
    // deno-lint-ignore no-empty
  } catch {}
};

const readIfExists = async (path: string): Promise<string | undefined> => {
  try {
    return await Deno.readTextFile(path);
    // deno-lint-ignore no-empty
  } catch {}
};

export class IODepartment implements fIODepartment {
  async readFile(path: string): Promise<string> {
    return await fetchIfValidURL(path) ??
      await readIfExists(path) ??
      "";
  }

  async writeFile(path: string, content: string): Promise<void> {
    await Deno.writeTextFile(path, content);
  }
}
