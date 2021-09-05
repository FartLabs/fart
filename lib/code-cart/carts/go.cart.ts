import type { MethodDetails } from "../mod.ts";
import { CodeCart, CodeCartEvent } from "../mod.ts";
import { convertFilenameToTargetFilename } from "../../utils.ts";

const goCart = new CodeCart();

goCart.addEventListener(
  CodeCartEvent.Import,
  (source: string, dependencies: string[]) => {
    if (dependencies.length > 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source, "");
    return `import "${targetFilename}"`;
  },
);

goCart.addEventListener(
  CodeCartEvent.StructOpen,
  (identifier: string, depo = true) =>
    `type ${identifier} ${depo ? "interface" : "struct"} {`,
);

goCart.addEventListener(
  CodeCartEvent.SetProperty,
  (identifier: string, _, type?: string) => {
    if (type !== undefined) return `${identifier} ${type}`;
    return `${identifier} interface {`;
  },
);

goCart.addEventListener(
  CodeCartEvent.SetMethod,
  (identifier: string, detail?: MethodDetails) => {
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
);

goCart.addEventListener(CodeCartEvent.StructClose, () => `}`);

export default goCart;
