import { compile } from "../../lib/fart.ts";
import cartridges from "../carts/mod.ts";
import typemaps from "../typemaps/mod.ts";

enum ContentType {
  TypeScript = "application/typescript; charset=UTF-8",
  JSON = "application/json; charset=UTF-8",
}

// const EXAMPLES: Record<string, string> = {
//   "pokemon.ts": `
// type Pokeball {
//   id*: string
//   used*: boolean

//   catch*: <string, boolean>
// }

// type Pokemon {
//   name*: string
//   ball: Pokeball
//   types*: { type1*: string
//             type2:  string }

//   obtain*: <Pokeball>
// }`,
// };

const makeError = (message: string, status = 400): Response =>
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

const makeFart = (
  cartridgeId: string,
  content: string,
): Response => {
  const cartridge = cartridges.vendor(cartridgeId);
  if (cartridgeId === undefined || cartridge === undefined) {
    return makeError(
      `No such language target ${cartridgeId}.`,
    );
  }
  const typemap = typemaps.vendor();
  if (typemap === undefined) {
    return makeError(
      `No such typemap.`,
    );
  }
  let code: string;
  try {
    code = compile(content, { cartridge, typemap });
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

export const handleRequest = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname === "/") return makeIndex();
  if (request.method === "GET") {
    const [_, target] = pathname.split("/"); // , ...breadcrumbs
    const input = await request.text();
    return await makeFart(target, input);
  }
  return makeError("Requested an unknown resource.", 404);
};
