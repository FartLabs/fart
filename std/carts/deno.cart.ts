import { Cart, CartEvent, MethodDetails } from "../../lib/gen/cart.ts";
import { convertFilenameToTargetFilename } from "../common.ts";

const denoCart = new Cart();

denoCart.addEventListener(
  CartEvent.Import,
  (source: string, dependencies: string[]) => {
    if (dependencies.length === 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source);
    const serializedDeps = dependencies.join(", ");
    return `import type { ${serializedDeps} } from "${targetFilename}";`;
  },
);

denoCart.addEventListener(
  CartEvent.StructOpen,
  (identifier: string) => `export interface ${identifier} {`,
);

denoCart.addEventListener(
  CartEvent.SetProperty,
  (identifier: string, required = false, type?: string) => {
    const assignment = required ? ":" : "?:";
    if (type === undefined) return `${identifier}${assignment} {`;
    return `${identifier}${assignment} ${type};`;
  },
);

denoCart.addEventListener(
  CartEvent.SetMethod,
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

denoCart.addEventListener(CartEvent.StructClose, () => `}`);

export default denoCart;
