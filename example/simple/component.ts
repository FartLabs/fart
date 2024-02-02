/**
 * Call is JSON representation of a function call.
 */
export interface Call<TID extends string, TArgs extends Args> {
  id: TID;
  args?: TArgs;
}

// deno-lint-ignore no-explicit-any
export type Args = any[];

/**
 * Fn is a function type.
 */
export type Fn = (...args: Args) => unknown;

/**
 * ArgsOf extracts the argument types of a function.
 */
export type ArgsOf<TFn extends Fn> = TFn extends
  (...args: infer TArgs) => unknown ? TArgs
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
 * FnMap is a map of functions.
 */
export type FnMap<TID extends string> = {
  [id in TID]: Fn;
};

/**
 * call calls a function by its ID with serialized arguments.
 */
export function call<
  TCalls extends FnMap<TID>,
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

const output = call(
  {
    generateGreet(id = "greet", defaultName = "world") {
      return `function ${id}(name = "${defaultName}") {
  return \`Hello, \${name}!\`;
}`;
    },
  },
  {
    id: "generateGreet",
    args: ["greet", "world"],
  },
);

console.log(output);

// deno run example/simple/component.ts
// ts json rpc experimentation. next step is to learn how to nest calls.
//
