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
    required: boolean = false,
    type?: string,
  ): string {
    const assignment = required ? ":" : "?:";
    if (type === undefined) return `${identifier}${assignment} {`;
    return `${identifier}${assignment} ${type};`;
  },

  method(
    identifier: string,
    detail?: MethodDetails,
  ): string {
    if (detail !== undefined) {
      const output = detail.output ?? "void";
      const assignment = detail.required ? ":" : "?:";
      if (detail.input === undefined) {
        return `${identifier}${assignment} () => ${output};`;
      }
      return `${identifier}${assignment} (input: ${detail.input}) => ${output};`;
    }
    return `${identifier}: () => void;`;
  },

  closeStruct(): string {
    return `}`;
  },
};
