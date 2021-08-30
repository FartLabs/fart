import { LanguageTarget } from "./types.ts";
import { compile } from "./fart.ts";

enum ContentType {
  TypeScript = "application/typescript; charset=UTF-8",
  JSON = "application/json; charset=UTF-8",
}

const EXAMPLES: Record<string, string> = {
  "pokemon": `
type Pokeball {
  id*: string
  used*: boolean

  catch*: <string, boolean>
}

type Pokemon {
  name*: string
  ball*: Pokeball
  types*: { type1*: string
            type2:  string }
}`,
};

const makeError = (message: string, status: number = 400): Response =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": ContentType.JSON },
  });

const makeIndex = (): Response =>
  new Response(
    JSON.stringify({
      message:
        "Welcome to the Fart server! Docs coming soon! For now, check out https://github.com/EthanThatOneKid/fart",
    }),
    {
      status: 200,
      headers: { "Content-Type": ContentType.JSON },
    },
  );

const makeFart = async (
  languageTarget: string,
  content: string,
  indentation?: string,
): Promise<Response> => {
  if (
    !Object.values(LanguageTarget).includes(languageTarget as LanguageTarget)
  ) {
    return makeError(
      `No such language target ${languageTarget}.`,
    );
  }
  let code: string;
  try {
    code = compile(content, {
      indentation,
      target: languageTarget as LanguageTarget,
    });
  } catch (error) {
    return makeError(error.message, 500);
  }
  // TODO: Add logic for all language targets.
  const contentType = ContentType.TypeScript;
  return new Response(
    code,
    {
      status: 200,
      headers: { "Content-Type": contentType },
    },
  );
};

export const handle = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return makeIndex();
  if (request.method === "GET") {
    const [_, target, exampleId] = pathname.split("/");
    const input = exampleId !== undefined
      ? EXAMPLES[exampleId]
      : await request.text();
    return await makeFart(target, input);
  }
  return makeError("Requested an unknown resource.", 404);
};
