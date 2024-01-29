import { Project } from "https://deno.land/x/ts_morph@21.0.1/mod.ts";

function add(a: number, b: number) {
  return a + b;
}

function subtract(a: number, b: number) {
  return a - b;
}

function multiply(a: number, b: number) {
  return a * b;
}

function divide(a: number, b: number) {
  return a / b;
}

// console.log(add(1, 2));
// console.log(Deno.readTextFileSync(new URL("./calculator.ts", import.meta.url)));

const project = new Project();
const sourceCode = Deno.readTextFileSync(
  new URL("./calculator.ts", import.meta.url),
);
const sourceFile = project.createSourceFile("calculator.ts", sourceCode);
const addFunction = sourceFile.getFunctionOrThrow("add");
console.log(addFunction.getReturnType().getText());
