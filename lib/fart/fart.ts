interface Usage {
  [id: string]: {
    usageDescription: string;
    check: (params: unknown) => string;
  }[];
}

interface Snippet<T> {
  name: string;
  tmplParameters: { [k in keyof T]: T[k] };
  tmplFn(params: T, source: string): string;
  // Apply filters to ignore unused imports, etc.
  tmplUsages(params: T, generated: string): string;
}

// There are parameters for generator/templates and there are parameters for
// the generated code. They are intended to provide the required information
// to understand how to use the generated code in context.

// Define whether template is composing down to a single file or multiple files.
// Usage use cases contain the context in which the generated code is used.
