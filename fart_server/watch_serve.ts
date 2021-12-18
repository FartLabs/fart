const restartServer = async () => {
    console.log(">>> restarting server");
    const { serve } = await import("./serve.ts");
    serve();
};

for await (const event of Deno.watchFs(".")) {
  console.log(">>>> event", event);
  restartServer();
}