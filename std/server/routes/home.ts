import { Mime } from "../common.ts";

export default (): Response =>
  new Response(
    JSON.stringify({
      message:
        "Welcome to the Fart server! Docs coming soon! For now, check out https://etok.codes/fart",
    }),
    {
      status: 200,
      headers: { "Content-Type": Mime.JSON },
    },
  );
