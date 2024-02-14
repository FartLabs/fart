/**
 * Registry is used to store and retrieve objects by name.
 */
// export type Registry<T> = Map<string, T>;

/**
 * Registry is used to store and retrieve objects by name.
 */
// export type Registry<T> = Map<string, T>;

// interface Registry {
//   [name: string]: (input: any) => any;
// }

// interface RegistryItem<TName extends string, TDependencies extends TName[]> {
//   dependencies: TDependencies;
//   fn: (input: { [name in TDependencies[number]]: any }) => any;
// }

export interface RegistryItem<
  TRegistry extends { [name: string]: any },
  TDependencies extends (keyof TRegistry)[],
  TOutput = any,
> {
  dependencies: TDependencies;
  fn(input: { [name in TDependencies[number]]: TRegistry[name] }): TOutput;
}

const item: RegistryItem<{ a: string; b: number }, ["a"]> = {
  dependencies: ["a"],
  fn: ({ a }) => a.length,
};

export type Registry<TRegistry extends { [name: string]: any }> = {
  [name in keyof TRegistry]: RegistryItem<TRegistry, (keyof TRegistry)[]>;
};

// TRegistry used as TSchema or TScope.
function createRegistry<TRegistry extends { [name: string]: any }>(
  registry: Registry<TRegistry>,
): Registry<TRegistry> {
  return {
    call: (name: keyof TRegistry) => {
      const item = registry[name];
      return registry[name];
    },
  };
}

const registry = createRegistry({
  a: { dependencies: [], fn: () => "Hello world!" },
  b: { dependencies: ["a"], fn: ({ a }) => a.length },
});

// type Registry<T extends string> = Record<
//   T,
//   {
//     fn: (input: { [name in T]: any }) => any;
//     dependencies: T[];
//   }
// >;

/**
 * System is used to store and retrieve functions by name.
 */
// export type System<T> = {
//   [name in keyof T]: T[name];
// };

// function makeSystem<T>(
//   registry: T,
// ): System<T> {
//   return registry;
// }

// export type Procedure<TDependency extends string> = (
//   input: Record<TDependency, Module>,
// ) => void;

/**
 * ModuleRegistry is used to store and retrieve modules by name.
 */
// export type ModuleRegistry = Registry<Module>;
