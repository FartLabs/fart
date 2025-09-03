import {
  Cart,
  CartEventName,
  MethodDetails as _MethodDetails,
} from "../../lib/gen/cart.ts";
import { convertFilenameToTargetFilename } from "../common.ts";

const denoServiceCart = new Cart();

denoServiceCart.addEventListener(
  CartEventName.Import,
  (event) => {
    if (event.dependencies.length === 0) return;
    const targetFilename = convertFilenameToTargetFilename(event.source);
    const serializedDeps = event.dependencies.join(", ");
    event.code.append(
      `import type { ${serializedDeps} } from "${targetFilename}";`,
    );
  },
);

denoServiceCart.addEventListener(
  CartEventName.StructOpen,
  (event) => {
    event.code.append(`export class ${event.identifier} {`);
    event.code.append(`private conn: Connection;`);
    event.code.append(`constructor(private server_id: string) {`);
    event.code.append(
      `if (server_id === undefined) throw new Error("Server ID must be passed to access external services").`,
    );
    event.code.append(`this.conn = new Connection(server_id);`);
    event.code.append(`}`);
  },
);

denoServiceCart.addEventListener(
  CartEventName.SetProperty,
  (event) => {
    if (!event.method) return;

    let signature: string | null = null;
    if (event.value === undefined) {
      signature = `public async ${event.identifier}(): Promise<void> {`;
    } else {
      // Parse method signature from value
      const parts = event.value.split(" -> ");
      if (parts.length === 2) {
        const inputType = parts[0].trim();
        const outputType = parts[1].trim();
        signature =
          `public async ${event.identifier}(input: ${inputType}): Promise<${outputType}> {`;
      } else {
        signature = `public async ${event.identifier}(): Promise<void> {`;
      }
    }

    if (signature) {
      event.code.append(signature);
      event.code.append(`return await this.conn.query("${event.identifier}");`);
      event.code.append(`}`);
    }
  },
);

denoServiceCart.addEventListener(CartEventName.StructClose, (event) => {
  event.code.append(`}`);
});

export default denoServiceCart;
