// deno run examples/registry/system.ts
if (import.meta.main) {
  // Define functions.
  const result = call(
    {
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
        return `if (import.meta.main) {
  ${id}();
}
  
function ${id}() {
  console.log(greet(add(9, 10).toString()));
}

${this.generateGreet("greet")}

${this.generateAdd("add")}`;
      },
    },
    { id: "generateGreet", args: ["greet", "world"] },
    // { id: "generateMain", args: ["main"] },
  );

  console.log(result);
}

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
 * CallOf represents a call to a function with serialized arguments.
 */
export interface CallOf<
  TID extends string,
  TFn extends Fn,
> {
  id: TID;
  args: Parameters<TFn>;
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
  TArgs extends Parameters<TCalls[TID]>,
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
