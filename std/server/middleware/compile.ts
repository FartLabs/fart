import { fetchGitHubFile, makeError } from "../common.ts";
import cartridges from "../../carts/mod.ts";
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
  const item = cartridges.vendor(cartridgeId);
  if (cartridgeId === undefined || item === undefined) {
    return makeError(`No such language target ${cartridgeId}.`);
  }
  const { cartridge, typemap, mimetype } = item;
  try {
    return new Response(
      await compile(content, { cartridge, typemap }),
      {
        status: 200,
        headers: { "Content-Type": mimetype },
      }
    );
  } catch (error) {
    return makeError(error.message, 500);
  }
};
