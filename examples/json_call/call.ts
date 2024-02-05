import { Eta } from "./developer_deps.ts";

/**
 * Call is JSON representation of a function call.
 */
export interface Call<TID extends string, TArgs extends Args> {
  id: TID;
  args?: TArgs;
}

// deno-lint-ignore no-explicit-any
export type Args = any[];

// deno-lint-ignore no-explicit-any
export type Fn = (...args: Args) => any;

/**
 * ArgsOf extracts the argument types of a function.
 */
export type ArgsOf<TFn extends Fn> = TFn extends (
  ...args: infer TArgs
  // deno-lint-ignore no-explicit-any
) => any ? TArgs
  : never;

/**
 * CallOf represents a call to a function with serialized arguments.
 */
export interface CallOf<
  TID extends string,
  TFn extends Fn,
> {
  id: TID;
  args: ArgsOf<TFn>;
}

/**
 * Calls is a map of function calls by their ID.
 */
export type Calls<TID extends string> = {
  [id in TID]: Fn;
};

function call<
  TCalls extends Calls<TID>,
  TID extends string,
  TArgs extends Args,
>(
  calls: TCalls,
  c: Call<TID, TArgs>,
) {
  const fn = calls[c.id];
  if (!fn) {
    throw new Error(`Function not found: ${c.id}`);
  }

  return fn(...(c.args || []));
}

// deno run --allow-read examples/json_call/call.ts > examples/json_call/call_generated.ts
// deno run examples/json_call/call_generated.ts
if (import.meta.main) {
  // Set up template engine.
  const templateEngine = new Eta();
  const executeGreetTemplate = templateEngine.compile(
    // I wish `import.meta.resolve("./greet.ts.tmpl")` worked, but it doesn't.
    Deno.readTextFileSync("./examples/json_call/greet.ts.tmpl"),
  );

  // Define functions.
  const fns = {
    generateGreet(id = "greet", defaultName = "world") {
      return templateEngine.render(
        executeGreetTemplate,
        { id, defaultName },
      );
    },
    generateAdd(id = "add") {
      return `function ${id}(a: number, b: number) {
return a + b;
}`;
    },
    generateMain(id = "main") {
      return `function ${id}() {
console.log(greet(add(9, 10).toString()));
}

if (import.meta.main) {
  ${id}();
}`;
    },
  };

  // TODO: fix type-safety.
  const result1 = call(
    fns,
    { id: "generateGreet", args: ["greet", 0] },
  );

  const result2 = call(
    fns,
    { id: "generateAdd", args: ["add"] },
  );

  const result3 = call(
    fns,
    { id: "generateMain" },
  );

  console.log([result1, result2, result3].join("\n"));
}
