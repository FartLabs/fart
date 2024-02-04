/**
 * Call is JSON representation of a function call.
 */
export interface Call<TID extends string, TArgs extends Args> {
  id: TID;
  args?: TArgs;
}

// deno-lint-ignore no-explicit-any
export type Args = any[];

export type Fn = (...args: Args) => unknown;

/**
 * ArgsOf extracts the argument types of a function.
 */
export type ArgsOf<TFn extends Fn> = TFn extends (
  ...args: infer TArgs
) => unknown ? TArgs
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

// deno run examples/json_call/call.ts > examples/json_call/call_generated.ts
// deno run examples/json_call/call_generated.ts
if (import.meta.main) {
  // const simpleGreetCall: CallOf<
  //   "generateGreet",
  //   typeof generateGreet
  // > = { id: "generateGreet", args: ["greet", "world"] };

  // const simpleGreetCall: CallOf<
  //   "generateGreet",
  //   typeof generateGreet
  // > = { id: "generateGreet", args: ["greet", 0] };

  // main.ts
  //deno:generate deno run greet_generator.ts

  // import { greet } from "./greet.ts";
  // console.log(greet("Ethan")); // See it is convenient to pair generated function "calls" with ts-morph because we can modify the function to fit our requirements such as exporting it so we can use it as a module.

  // TODO: Show grabbing template snippets from a file via ts-morph.
  const fns = {
    generateGreet(id = "greet", defaultName = "world") {
      return `function ${id}(name = "${defaultName}") {
return \`Hello, \${name}!\`;
}`;
    },
    generateAdd(id = "add") {
      return `function ${id}(a: number, b: number) {
return a + b;
}`;
    },
    generateMain(id = "main") {
      return `function ${id}() {
console.log(greet(add(60, 9).toString()));
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
