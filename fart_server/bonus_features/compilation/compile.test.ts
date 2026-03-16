import { assertEquals } from "@std/assert";
import { setup } from "../../serve.ts";
import { inject } from "../../utils.ts";

// Because we need to test native Deno imports via HTTP, we'll actually
// spin up a lightweight local server that just calls the injected routes
// to simulate the real Fart server.
async function runWithTestServer(testFn: (serverUrl: string) => Promise<void>) {
  setup();
  const ac = new AbortController();

  const server = Deno.serve(
    { port: 0, signal: ac.signal },
    async (req: Request) => {
      const originalFetch = globalThis.fetch;
      // Mock global fetch to intercept Raw Github requests
      globalThis.fetch = (
        input: string | URL | Request,
        init?: RequestInit,
      ) => {
        const fetchUrl = input.toString();
        if (
          fetchUrl.includes("raw.githubusercontent.com/test_local/source.fart")
        ) {
          return Promise.resolve(new Response(`type TestStruct { name: string }`, {
            status: 200,
          }));
        }
        return originalFetch(input, init);
      };

      // Wrap the standard inject
      const res = await inject(req);

      // Serve the literal implementation file itself
      const url = new URL(req.url);
      if (url.pathname.includes("/test_local/impl")) {
        globalThis.fetch = originalFetch;
        return new Response(`export default { sayHello: () => "Hello!" };`, {
          status: 200,
          headers: { "Content-Type": "application/typescript" },
        });
      }

      // Restore fetch
      // (In a real robust test suite we'd do this in afterAll, but here is fine since Deno.serve handles it synchronously for the test scope)
      globalThis.fetch = originalFetch;

      return res || new Response("Not Found", { status: 404 });
    },
  );

  const addr = server.addr as Deno.NetAddr;
  const url = `http://localhost:${addr.port}`;

  try {
    await testFn(url);
  } finally {
    ac.abort();
    await server.finished;
  }
}

Deno.test("deno statically imports generated typescript from Fart Server", async () => {
  await runWithTestServer(async (serverUrl) => {
    const tempFile = await Deno.makeTempFile({ suffix: ".ts" });

    // Write a ts file that imports the dynamic Fart URL compilation.
    // We rewrite the GitHub raw URL logic locally in the test server.
    // NOTE: Append '.ts' to the fragment so Deno evaluates it as TypeScript.
    const code = `
      import type { TestStruct } from "${serverUrl}/ts/test_local/source.fart#.ts";
      const obj: TestStruct = { name: "Fart Tester" };
      console.log(obj.name);
    `;
    await Deno.writeTextFile(tempFile, code);

    const command = new Deno.Command(Deno.execPath(), {
      args: ["run", "--allow-net", "--allow-import", tempFile],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await command.output();
    const stdout = new TextDecoder().decode(output.stdout).trim();

    assertEquals(output.success, true);
    assertEquals(stdout, "Fart Tester");

    await Deno.remove(tempFile);
  });
});

Deno.test("deno imports and executes implementation mapped TS code", async () => {
  await runWithTestServer(async (serverUrl) => {
    const tempFile = await Deno.makeTempFile({ suffix: ".ts" });

    // We request the compilation with the ~ mapping to an impl file.
    // NOTE: Append '.ts' so Deno's remote loader natively recognizes it as TypeScript.
    const code = `
      import Impl from "${serverUrl}/ts/test_local/source.fart~./test_local/impl.ts#.ts";
      console.log(Impl.sayHello());
    `;
    await Deno.writeTextFile(tempFile, code);

    const command = new Deno.Command(Deno.execPath(), {
      args: ["run", "--allow-net", "--allow-import", tempFile],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await command.output();
    const stdout = new TextDecoder().decode(output.stdout).trim();
    if (!output.success) {
      console.error(new TextDecoder().decode(output.stderr));

      const debugRes = await fetch(
        `${serverUrl}/ts/test_local/source.fart~test_local/impl.ts#.ts`,
      );
      console.error(
        "DEBUG MODULE URL:",
        debugRes.status,
        await debugRes.text(),
        debugRes.headers.get("content-type"),
      );
    }

    assertEquals(output.success, true);
    assertEquals(stdout, "Hello!");

    await Deno.remove(tempFile);
  });
});

Deno.test("fart_server serves HTML Syntax Highlights natively via specific routes", async () => {
  await runWithTestServer(async (serverUrl) => {
    // We request the generated HTML payload directly from the compiler middleware.
    const htmlUrl = `${serverUrl}/html.syntax.gh/test_local/source.fart`;

    const response = await fetch(htmlUrl);
    const htmlOutput = await response.text();

    assertEquals(response.status, 200);
    assertEquals(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
    );

    // Checks that the HTML actually contains the table tags from `html_gh_syntax` and its source code bindings
    assertEquals(htmlOutput.includes("<tbody>"), true);
    assertEquals(
      htmlOutput.includes('<span class="pl-en">TestStruct</span>'),
      true,
    );
  });
});
