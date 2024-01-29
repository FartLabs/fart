export interface InputSchema {
  /**
   * info is the JSON Schema type info about the input.
   */
  info: any;
}

interface Input {
  idk: number;
}

// TODO: Construct
// - Component/ComponentSchema

// A component is a function with a return type of generated,
// deterministic programs/data. The input parameter is a dynamically typed JSON object.

// A component can generate the same code over and over again given the same/no inputs (using default inputs).

// Research Lisp macros and C/C++ template macros.
