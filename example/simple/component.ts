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

// export type Calls<TID extends string> = {
//   [id in TID]: Fn;
// };

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

function generateGreet(id = "greet", defaultName = "world") {
  return `function ${id}(name = "${defaultName}") {
  return \`Hello, \${name}!\`;
}`;
}

const simpleGreetCall: CallOf<
  "generateGreet",
  typeof generateGreet
> = { id: "generateGreet", args: ["greet", "world"] };

console.log({ simpleGreetCall });
console.log(call({ generateGreet }, simpleGreetCall));

// deno run example/simple/component.ts
