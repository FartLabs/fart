import { convertFilenameToTargetFilename } from "./utils.ts";

// TODO(ethanthatonekid): Create tests in `./code-templates.test.ts`.

/**
 * This is the information stored for a single import in code.
 *
 * Example 1:
 * ```ts
 * // Internal
 * const import: CodeImport = {
 *   source: "./types.ts",
 *   dependencies: ["Thing1", "Thing2"],
 * };
 *
 * // Generated
 * import { Thing1, Thing2 } from "./types.ts";
 * ```
 *
 * Example 2:
 * * ```ts
 * // Internal
 * const import: CodeImport = {
 *   source: "./types.ts",
 *   alias: "Things",
 * };
 *
 * // Generated
 * import * as Things from "./types.ts";
 * ```
 *
 * Example 3:
 * ```ts
 * // Internal
 * const import: CodeImport = { source: "./types.ts" };
 *
 * // Generated
 * import "./types.ts";
 * ```
 *
 * Example 4:
 * ```ts
 * // Internal
 * const import: CodeImport = {
 *   source: "./types.ts",
 *   alias: "Things",
 *   dependencies: ["Thing1", "Thing2"],
 * };
 *
 * // Generated
 * import { Thing1, Thing2 } from "./types.ts"; // The dependencies setting has priority over the alias setting.
 * ```
 */
export interface CodeImport {
  source: string;
  alias?: string;
  dependencies?: string[];
}

/**
 * If a code generation function returns null, that means that the
 * target language omits the requested generated code. A null return
 * value will prevent the requested line from being appended to the result.
 */
export interface CodeTemplate {
  import: (impos: CodeImport[]) => string | null;
  struct: (id: string) => string | null;
  property: (id: string, type: string) => string | null;
  method: (id: string, input: string, output: string) => string | null;
  closeStruct: () => string | null;
}

export const DenoTypeScriptCodeTemplate: CodeTemplate = {
  import(imports: CodeImport[]): string {
    let results = [];
    for (const impo of imports) {
      const targetFilename = convertFilenameToTargetFilename(impo.source);
      let importStatement = `import "${targetFilename}";`;
      if (impo.dependencies !== undefined) {
        const serializedDeps = impo.dependencies.join(", ");
        importStatement =
          `import type { ${serializedDeps} } from "${targetFilename}";`;
      } else if (impo.alias !== undefined) {
        importStatement = `import * as ${impo.alias} from "${targetFilename}";`;
      }
      results.push(importStatement);
    }
    return results.join("\n");
  },
  struct(identifier: string): string {
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
    input: string,
    output: string,
    async: boolean = false,
  ): string {
    if (async) output = `Promise<${output}>`;
    return `${identifier}: (in: ${input}) => ${output}';`;
  },
  closeStruct(): string {
    return `}`;
  },
};
