import { Cart, CartEvent, MethodDetails } from "../../lib/gen/cart.ts";
import { convertFilenameToTargetFilename } from "../common.ts";

const denoServiceCart = new Cart();

denoServiceCart.addEventListener(
  CartEvent.Import,
  (source: string, dependencies: string[]) => {
    if (dependencies.length === 0) return null;
    const targetFilename = convertFilenameToTargetFilename(source);
    const serializedDeps = dependencies.join(", ");
    return `import type { ${serializedDeps} } from "${targetFilename}";`;
  },
);

denoServiceCart.addEventListener(
  CartEvent.StructOpen,
  (identifier: string) => [
    [`export class ${identifier} {`],
    ["", `private conn: Connection;`],
    ["", `constructor(private server_id: string) {`],
    [
      "",
      "",
      `if (server_id === undefined) throw new Error("Server ID must be passed to access external services").`,
    ],
    ["", `this.conn = new Connection(server_id);`],
    ["", `}`],
  ],
);

denoServiceCart.addEventListener(
  CartEvent.SetMethod,
  (identifier: string, detail?: MethodDetails) => {
    let signature: string | null = null;
    if (
      detail === undefined ||
      (detail.input === undefined && detail.output === undefined)
    ) {
      signature = `public async ${identifier}(): Promise<void> {`;
    } else if (detail.input !== undefined && detail.output === undefined) {
      signature =
        `public async ${identifier}(input: ${detail.input}): Promise<void> {`;
    } else if (detail.input === undefined && detail.output !== undefined) {
      const outputType = detail.output.startsWith("Promise")
        ? detail.output
        : `Promise<${detail.output}>`;
      signature = `public async ${identifier}(): ${outputType} {`;
    } else if (detail.input !== undefined && detail.output !== undefined) {
      const outputType = detail.output.startsWith("Promise")
        ? detail.output
        : `Promise<${detail.output}>`;
      signature =
        `public async ${identifier}(input: ${detail.input}): ${outputType} {`;
    } else if (signature === null) return null;
    return [
      ["", signature],
      ["", "", `return await this.conn.query("${identifier}");`],
      ["", `}`],
    ];
  },
);

denoServiceCart.addEventListener(CartEvent.StructClose, () => `}`);

export default denoServiceCart;
