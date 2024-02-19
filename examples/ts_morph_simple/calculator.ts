import { Project } from "./developer_deps.ts";

function add(a: number, b: number) {
  return a + b;
}

// deno run --allow-read examples/ts_morph_simple/calculator.ts
if (import.meta.main) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceCode = Deno.readTextFileSync(
    new URL("./calculator.ts", import.meta.url),
  );
  const sourceFile = project.createSourceFile("calculator.ts", sourceCode);
  const addFunction = sourceFile.getFunctionOrThrow("add");

  // TODO: Add calculator_test.ts to test these cases.
  console.log(addFunction.getText());
  console.log("// add(1, 1) =", add(1, 1));
}
