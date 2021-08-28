import { convertFilenameToTargetFilename } from "./utils.ts";

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export interface TargetGrammar {
  import: (src: string, deps: string[]) => string | null;
  struct: (id: string) => string | null;
  property: (id: string, type: string) => string | null;
  method: (id: string, input: string, output: string) => string | null;
  closeStruct: () => string | null;
}

export class TypeScriptGrammar implements TargetGrammar {
  import(source: string, dependencies: string[]): string {
    const targetFilename = convertFilenameToTargetFilename(source);
    const serializedDeps = dependencies.join(", ");
    return `import type { ${serializedDeps} } from "${targetFilename}";`;
  }

  struct(identifier: string): string {
    return `export interface ${identifier} {`;
  }

  property(
    identifier: string,
    type: string,
    required: boolean = false,
  ): string {
    const assignment = required ? ":" : "?:";
    return `${identifier}${assignment} ${type};`;
  }

  method(
    identifier: string,
    input: string,
    output: string,
    async: boolean = false,
  ): string {
    if (async) output = `Promise<${output}>`;
    return `${identifier}: (in: ${input}) => ${output}';`;
  }

  closeStruct(): string {
    return `}`;
  }
}
