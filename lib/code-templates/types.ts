export interface MethodDetails {
  input?: string;
  output?: string;
}

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export interface CodeTemplate {
  import: (src: string, dependencies: string[]) => string | null;
  openStruct: (id: string) => string | null;
  property: (id: string, type: string, required?: boolean) => string | null;
  method: (id: string, detail?: MethodDetails) => string | null;
  closeStruct: () => string | null;
}
