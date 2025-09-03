import {
  Cart,
  CartEventName,
  MethodDetails as _MethodDetails,
} from "../../lib/gen/cart.ts";
import { convertFilenameToTargetFilename } from "../common.ts";

const goCart = new Cart();

goCart.addEventListener(
  CartEventName.Import,
  (event) => {
    if (event.dependencies.length > 0) return;
    const targetFilename = convertFilenameToTargetFilename(event.source, "");
    event.code.append(`import "${targetFilename}"`);
  },
);

goCart.addEventListener(
  CartEventName.StructOpen,
  (event) => {
    const typeKeyword = event.department ? "interface" : "struct";
    event.code.append(`type ${event.identifier} ${typeKeyword} {`);
  },
);

goCart.addEventListener(
  CartEventName.SetProperty,
  (event) => {
    if (event.method) {
      // Handle method
      if (event.value !== undefined) {
        const parts = event.value.split(" -> ");
        if (parts.length === 2) {
          const inputType = parts[0].trim();
          const outputType = parts[1].trim();
          event.code.append(
            `${event.identifier}(p ${inputType}) (${outputType})`,
          );
        } else {
          event.code.append(`${event.identifier}()`);
        }
      } else {
        event.code.append(`${event.identifier}()`);
      }
    } else {
      // Handle property
      if (event.value !== undefined) {
        event.code.append(`${event.identifier} ${event.value}`);
      } else {
        event.code.append(`${event.identifier} interface {`);
      }
    }
  },
);

goCart.addEventListener(CartEventName.StructClose, (event) => {
  event.code.append(`}`);
});

export default goCart;
