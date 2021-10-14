import { fetchGitHubFile, makeError, Mime } from "../common.ts";
import cartridges from "../../carts/mod.ts";
import typemaps from "../../typemaps/mod.ts";
import { compile } from "../../../lib/fart.ts";

const processRequest = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const [id, ...path] = pathname.split("/").slice(1);
  const file = await fetchGitHubFile(path.join("/"), /*transform=*/ true);
  const content = file ?? await request.text();
  return { id, content };
};

export default async (request: Request): Promise<Response> => {
  const { id: cartridgeId, content } = await processRequest(request);
  const cartridge = cartridges.vendor(cartridgeId);
  if (cartridgeId === undefined || cartridge === undefined) {
    return makeError(`No such language target ${cartridgeId}.`);
  }
  const typemapId = cartridgeId.split(".").shift();
  const typemap = typemaps.vendor(typemapId);
  if (typemap === undefined) {
    return makeError(`No such typemap.`);
  }
  let code: string;
  try {
    code = await compile(content, { cartridge, typemap });
  } catch (error) {
    return makeError(error.message, 500);
  }
  return new Response(code, {
    status: 200,
    headers: { "Content-Type": Mime.TypeScript },
  });
};
