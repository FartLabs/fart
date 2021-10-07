import { Cart, CartEvent, MethodDetails } from "../../lib/gen/cart.ts";
import { convertFilenameToTargetFilename } from "../common.ts";

const goCart = new Cart();

goCart.addEventListener(
  CartEvent.Import,
  (source: string, dependencies: string[]) => {
    if (dependencies.length > 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source, "");
    return `import "${targetFilename}"`;
  },
);

goCart.addEventListener(
  CartEvent.StructOpen,
  (identifier: string, depo = true) =>
    `type ${identifier} ${depo ? "interface" : "struct"} {`,
);

goCart.addEventListener(
  CartEvent.SetProperty,
  (identifier: string, _, type?: string) => {
    if (type !== undefined) return `${identifier} ${type}`;
    return `${identifier} interface {`;
  },
);

goCart.addEventListener(
  CartEvent.SetMethod,
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

goCart.addEventListener(CartEvent.StructClose, () => `}`);

export default goCart;
