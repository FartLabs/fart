const makeWorker = () => {
    const workerPath = new URL("./serve.ts", import.meta.url).href;
    return new Worker(workerPath, { type: "module", deno: true })
};

const resetWorker = () => {
    worker.terminate();
    worker = makeWorker();
}

let worker = makeWorker();

for await (const event of Deno.watchFs(".")) {
  console.log(">>>> event", event);
  resetWorker();
}