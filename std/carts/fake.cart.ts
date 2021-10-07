import { Cart, CartEvent } from "../../lib/gen/cart.ts";

const fake = new Cart();

export const RESULTS = {
  [CartEvent.FileStart]: "A",
  [CartEvent.Import]: "B",
  [CartEvent.StructOpen]: "C",
  [CartEvent.SetProperty]: "D",
  [CartEvent.SetMethod]: "E",
  [CartEvent.StructClose]: "F",
  [CartEvent.FileEnd]: "G",
};

fake.on(CartEvent.FileStart, () => RESULTS[CartEvent.FileStart]);
fake.on(CartEvent.Import, () => RESULTS[CartEvent.Import]);
fake.on(CartEvent.StructOpen, () => RESULTS[CartEvent.StructOpen]);
fake.on(CartEvent.SetProperty, () => RESULTS[CartEvent.SetProperty]);
fake.on(CartEvent.SetMethod, () => RESULTS[CartEvent.SetMethod]);
fake.on(CartEvent.StructClose, () => RESULTS[CartEvent.StructClose]);

export default fake;
