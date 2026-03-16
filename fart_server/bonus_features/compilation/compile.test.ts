import { assertEquals } from "@std/assert";
import { setup } from "../../serve.ts";
import { inject } from "../../utils.ts";

// Because we need to test native Deno imports via HTTP, we'll actually
// spin up a lightweight local server that just calls the injected routes
// to simulate the real Fart server.
async function runWithTestServer(testFn: (serverUrl: string) => Promise<void>) {
  setup();
  const ac = new AbortController();
  
  const server = Deno.serve({ port: 0, signal: ac.signal }, async (req: Request) => {
    // If the request is looking for raw github content, we intercept it 
    // to return our local mocked fart file for testing, avoiding internet dependencies.
    const url = new URL(req.url);
    if (url.pathname.includes("/ts/test_local/source.fart")) {
      // Simulate what `compileFartToTs` would output:
      // The transpiled type, plus optionally the default export
      let responseText = `export interface TestStruct { name: string; }\n`;
      if (url.pathname.includes("~test_local/impl.ts")) {
        responseText += `import Impl from "http://localhost:${url.port}/test_local/impl.ts";\nexport default Impl;\n`;
      }
      return new Response(responseText, { 
        status: 200, 
        headers: { "Content-Type": "application/typescript" } 
      });
    }
    
    // Serve the literal implementation file itself
    if (url.pathname.includes("/test_local/impl")) {
      return new Response(`export default { sayHello: () => "Hello!" };`, { 
        status: 200, 
        headers: { "Content-Type": "application/typescript" } 
      });
    }

    // Wrap the standard inject
    const res = await inject(req);
    return res || new Response("Not Found", { status: 404 });
  });

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
      import Impl from "${serverUrl}/ts/test_local/source.fart~test_local/impl.ts#.ts";
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
    }
    
    assertEquals(output.success, true);
    assertEquals(stdout, "Hello!");
    
    await Deno.remove(tempFile);
  });
});
