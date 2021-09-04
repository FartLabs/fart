import { convertFilenameToTargetFilename } from "../utils.ts";
import type { CodeTemplate, MethodDetails } from "./types.ts";

export const GoCodeTemplate: CodeTemplate = {
  import(source: string, dependencies: string[]): string | null {
    if (dependencies.length > 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source, "");
    return `import "${targetFilename}"`;
  },

  openStruct(identifier: string): string {
    return `type ${identifier} interface {`;
  },

  property(identifier: string, _, type?: string): string {
    if (type !== undefined) return `${identifier}() ${type}`;
    return `${identifier}() interface {`;
  },

  method(
    identifier: string,
    detail?: MethodDetails,
  ): string {
    if (detail !== undefined) {
      if (detail.input !== undefined && detail.output !== undefined) {
        return `${identifier}(p ${detail.input}) (${detail.output})`;
      }
      if (detail.input !== undefined) {
        return `${identifier}(p ${detail.input})`;
      }
      if (detail.output !== undefined) {
        return `${identifier}() (${detail.output})`;
      }
    }
    return `${identifier}()`;
  },

  closeStruct(): string {
    return `}`;
  },
};
