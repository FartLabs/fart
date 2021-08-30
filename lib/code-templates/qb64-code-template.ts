import { LanguageTarget } from "../types.ts";
import { convertFilenameToTargetFilename } from "../utils.ts";
import type { CodeTemplate } from "./types.ts";

export const QB64CodeTemplate: CodeTemplate = {
  // See https://www.qb64.org/wiki/DECLARE_LIBRARY#Examples.
  openStruct(identifier: string): string {
    return `TYPE ${identifier}`;
  },

  property(identifier: string, _, type?: string): string {
    if (type !== undefined) return `${identifier} AS ${type}`;
    return `${identifier} AS TYPE`;
  },

  closeStruct(): string {
    return `END TYPE`;
  },

  // See https://www.qb64.org/wiki/$INCLUDE#Examples.
  import(source: string, dependencies: string[]): string | null {
    if (dependencies.length > 0) return null;
    const basicFileExt = LanguageTarget.Basic;
    const targetFilename = convertFilenameToTargetFilename(
      source,
      basicFileExt,
    );
    return `REM $INCLUDE: '${targetFilename}'`;
  },

  method() {
    return null;
  },
};
