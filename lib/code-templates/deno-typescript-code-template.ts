import { convertFilenameToTargetFilename } from "../utils.ts";
import type { CodeTemplate, MethodDetails } from "./types.ts";

export const DenoTypeScriptCodeTemplate: CodeTemplate = {
  import(source: string, dependencies: string[]): string | null {
    if (dependencies.length === 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source);
    const serializedDeps = dependencies.join(", ");
    return `import type { ${serializedDeps} } from "${targetFilename}";`;
  },

  openStruct(identifier: string): string {
    return `export interface ${identifier} {`;
  },

  property(
    identifier: string,
    type: string,
    required: boolean = false,
  ): string {
    const assignment = required ? ":" : "?:";
    return `${identifier}${assignment} ${type};`;
  },

  method(
    identifier: string,
    detail?: MethodDetails,
  ): string {
    if (detail !== undefined) {
      let output = detail.output ?? "void";
      if (detail.input === undefined) return `${identifier}: () => ${output};`;
      return `${identifier}: (input: ${detail.input}) => ${output};`;
    }
    return `${identifier}: () => void;`;
  },

  closeStruct(): string {
    return `}`;
  },
};
