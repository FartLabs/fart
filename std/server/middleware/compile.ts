import { fetchGitHubFile, makeError } from "../common.ts";
import cartridges from "../../carts/mod.ts";
import { compile } from "../../../lib/fart.ts";

const processRequest = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const [sourceFartname, implementationPathname] = pathname.split("~");
  const [partialId, ...path] = sourceFartname.split("/").slice(1);
  const langId = pathname.split(".").pop();
  const id = langId === undefined || partialId.startsWith(langId)
    ? partialId
    : `${partialId}.${langId}`;
  const file = await fetchGitHubFile(path.join("/"), /*transform=*/ true);
  const content = file ?? await request.text();
  return { id, content, implementationPathname };
};

export default async (request: Request): Promise<Response> => {
  const { id: cartridgeId, content, implementationPathname } =
    await processRequest(request);
  const item = cartridges.vendor(cartridgeId);
  if (cartridgeId === undefined || item === undefined) {
    return makeError(`No such language target ${cartridgeId}.`);
  }
  const { cartridge, typemap, mimetype } = item;
  try {
    return new Response(
      await compile(content, { cartridge, typemap, implementationPathname }),
      {
        status: 200,
        headers: { "Content-Type": mimetype },
      },
    );
  } catch (error) {
    return makeError(error.message, 500);
  }
};
