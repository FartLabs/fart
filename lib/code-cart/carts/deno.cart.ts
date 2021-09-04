import type { MethodDetails } from "../mod.ts";
import { CodeCart, CodeCartEvent } from "../mod.ts";
import { convertFilenameToTargetFilename } from "../../utils.ts";

const denoCart = new CodeCart();

denoCart.addEventListener(
  CodeCartEvent.Import,
  (source: string, dependencies: string[]) => {
    if (dependencies.length === 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source);
    const serializedDeps = dependencies.join(", ");
    return `import type { ${serializedDeps} } from "${targetFilename}";`;
  },
);

denoCart.addEventListener(
  CodeCartEvent.StructOpen,
  (identifier: string) => `export interface ${identifier} {`,
);

denoCart.addEventListener(
  CodeCartEvent.SetProperty,
  (identifier: string, required = false, type?: string) => {
    const assignment = required ? ":" : "?:";
    if (type === undefined) return `${identifier}${assignment} {`;
    return `${identifier}${assignment} ${type};`;
  },
);

denoCart.addEventListener(
  CodeCartEvent.SetMethod,
  (identifier: string, detail?: MethodDetails) => {
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
);

denoCart.addEventListener(CodeCartEvent.StructClose, () => `}`);

export default denoCart;
