export interface Component<
  TType extends string = string,
  // deno-lint-ignore no-explicit-any
  TProps = any,
> {
  type: TType;
  properties: TProps;
  children?: (Component | string)[];
}

export interface GenerateFn<
  TComponent extends Component = Component,
  TOutput = string,
> {
  (component: TComponent): TOutput;
}

/**
 * Call is JSON representation of a function call.
 */
export interface Call<TID extends string, TArgs extends unknown[]> {
  id: TID;
  args?: TArgs;
}

// Do Fart functions call other Fart functions?

export type AmbiguousCall<
  TID extends string = string,
  TArgs extends unknown[] = unknown[],
> = Call<TID, TArgs>;

function generateGreet(id = "greet", defaultName = "world") {
  return `function ${id}(name = "${defaultName}") {
  return \`Hello, \${name}!\`;
}`;
}

// TODO: Infer call type from generate function.

const simpleGreetCall = { id: "generateGreet" } satisfies AmbiguousCall;

export interface CallRouter {
}

function call<TID extends string, TArgs extends unknown[]>(
  c: Call<TID, TArgs>,
) {
  // switch (call.id) {
  //   case "generateGreet":
  //     return generateGreet(...call.args);
  // }
}
// A component represents a call to a pure deterministic function with simplified/serialized arguments.
