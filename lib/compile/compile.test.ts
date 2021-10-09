import { CompilationSettings, compile } from "./compile.ts";
import { assertEquals } from "../../deps/std/testing.ts";
// import { CartEventName } from "../gen/cart.ts";
import { default as fakeTypeMap } from "../../std/typemaps/fake.ts";
import {
  default as fakeCartridge,
  RESULTS,
} from "../../std/carts/fake.cart.ts";

const TEST_INDENT = "  ";
const NEW_LINE = "\n";
const TEST_SETTINGS: CompilationSettings = {
  cartridge: fakeCartridge,
  typemap: fakeTypeMap,
};

// Deno.test("Empty input results in empty output", () => {
//   const actual = compile(``, TEST_SETTINGS);
//   const expected = ``;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles import statement", () => {
//   const actual = compile(
//     `impo \`./path/to/types\` {
//     Thing1, Thing2, Thing3
//   }`,
//     TEST_SETTINGS,
//   );
//   const expected = RESULTS[CartEvent.Import];
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles `type` statement", () => {
//   const actual = compile(
//     `type Thing {
//     abc: string
//     def: number
//     ghi: boolean
//   }`,
//     TEST_SETTINGS,
//   );
//   const expected = RESULTS[CartEvent.StructOpen] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + RESULTS[CartEvent.StructClose];
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles nested `type` statement", () => {
//   const actual = compile(
//     `type Thing {
//     abc: string
//     def: number
//     ghi: {
//       uvw: {
//         xyz: boolean
//       }
//     }
//   }`,
//     TEST_SETTINGS,
//   );
//   const expected = RESULTS[CartEvent.StructOpen] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT.repeat(2) +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT.repeat(3) +
//     RESULTS[CartEvent.SetProperty] + NEW_LINE + TEST_INDENT.repeat(2) +
//     RESULTS[CartEvent.StructClose] + NEW_LINE + TEST_INDENT +
//     RESULTS[CartEvent.StructClose] + NEW_LINE +
//     RESULTS[CartEvent.StructClose];
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles `depo` statement", () => {
//   const actual = compile(
//     `depo ThingService {
//     doThis: <number, string>
//     doThat: <string, boolean>
//   }`,
//     TEST_SETTINGS,
//   );
//   const expected = ``;
//   assertEquals(actual, expected);
// });

// Deno.test("Omits property assignments from `depo` statement", () => {
//   const actual = compile(
//     `depo ThingService {
//     doThis: <number>
//     doThat: <string>
//     abc: string
//     def: { ghi: boolean }
//   }`,
//     TEST_SETTINGS,
//   );
//   const expected = ``;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles entire service definition", () => {
//   const actual = compile(`type Apple {
//     weight*: number
//   }
//   type AppleRequest {
//     filters: {
//       minWeight: number
//       maxWeight: number
//     }
//   }
//   type AppleResponse {
//     value: Apple
//   }
//   depo AppleService {
//     pickBestApple: <AppleRequest, AppleResponse>
//   }`);
//   const expected = `export interface Apple {
//   weight: number;
// }
// export interface AppleRequest {
//   filters?: {
//     minWeight?: number;
//     maxWeight?: number;
//   }
// }
// export interface AppleResponse {
//   value?: Apple;
// }
// export interface AppleService {
//   pickBestApple: (input: AppleRequest) => AppleResponse;
// }`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles nested `type` statement with required properties", () => {
//   const actual = compile(`type Thing {
//     abc*: string
//     def*: number
//     ghi*: {
//       jkl*: boolean
//       mno*: boolean
//     }
//   }`);
//   const expected = `export interface Thing {
//   abc: string;
//   def: number;
//   ghi: {
//     jkl: boolean;
//     mno: boolean;
//   }
// }`;
//   assertEquals(actual, expected);
// });

// Deno.test("Successfully compiles nested `type` statement with methods", () => {
//   const actual = compile(`type Farmer {
//     getApples: <string, number>
//   }`);
//   const expected = `export interface Farmer {
//   getApples?: (input: string) => number;
// }`;
//   assertEquals(actual, expected);
// });

/* TODO: Compile using QB64 cartridge.
Deno.test("Successfully compiles to QB64", () => {
  const settings: FartSettings = { target: LanguageTarget.Basic };
  const actual = compile(
    `type Calendar {
      color: string
      year: number
    }`,
    settings,
  );
  const expected = `TYPE Calendar
  color AS STRING
  year AS DOUBLE
END TYPE`;
  assertEquals(actual, expected);
});
*/
