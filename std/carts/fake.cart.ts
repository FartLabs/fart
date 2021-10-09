import { Cart, CartEventName } from "../../lib/gen/cart.ts";

const fake = new Cart();

export const RESULTS = {
  [CartEventName.FileStart]: "// Hello World",
  [CartEventName.Import]: "import Something from './path/to/something.ts'",
  [CartEventName.StructOpen]: "interface Thing {",
  [CartEventName.SetProperty]: "foo: string;",
  [CartEventName.StructClose]: "}",
  [CartEventName.FileEnd]: "// End of File",
};

fake.on(
  CartEventName.FileStart,
  (event) => event.code.append(RESULTS.file_start),
);

fake.on(
  CartEventName.Import,
  (event) => event.code.append(RESULTS.import),
);

fake.on(
  CartEventName.StructOpen,
  (event) => event.code.append(RESULTS.struct_open),
);

fake.on(
  CartEventName.SetProperty,
  (event) => event.code.append(RESULTS.set_property),
);

fake.on(
  CartEventName.StructClose,
  (event) => event.code.append(RESULTS.struct_close),
);

export default fake;
