import { Token, tokenize } from "./tokenize.ts";
import { Lexicon } from "./constants/lexicon.ts";
import { Builder } from "./gen/builder.ts";
import { validateSettings } from "./utils.ts";
import { FartSettings, LanguageTarget } from "./types.ts";
import type { Cart } from "./gen/cart.ts";
import { TypeMap, TYPEMAPS } from "./typemaps.ts";
import DenoCart from "./gen/carts/deno.cart.ts";

const determineCodeCartridge = (target: LanguageTarget): Cart => {
  switch (target) {
    case LanguageTarget.TypeScript:
    default:
      return DenoCart;
  }
};

const determineTypeMap = (target: LanguageTarget): TypeMap => {
  switch (target) {
    case LanguageTarget.Basic:
      return TYPEMAPS[LanguageTarget.Basic];
    case LanguageTarget.Go:
      return TYPEMAPS[LanguageTarget.Go];
    case LanguageTarget.TypeScript:
    default:
      return TYPEMAPS[LanguageTarget.TypeScript];
  }
};

export function compile(content: string, settings?: FartSettings): string {
  const validatedSettings = validateSettings(settings);
  const codeCartridge = determineCodeCartridge(validatedSettings.target);
  const typemap = determineTypeMap(validatedSettings.target);
  const builder = new Builder(
    codeCartridge,
    typemap,
    validatedSettings.indentation,
  );
  const it = tokenize(content);
  let curr: IteratorResult<Token, Token> = it.next();
  const nextToken = (): Token => (curr = it.next()).value;
  const nextList = (
    ateFirstToken = false,
    maxLength?: number,
    closingToken: Lexicon = Lexicon.Denester,
  ): Token[] => {
    if (!ateFirstToken) nextToken(); // TODO: Assert this token === openingToken.
    const list: Token[] = [];
    const isLengthValid = maxLength === undefined || maxLength >= list.length;
    while (!nextToken().is(closingToken) && isLengthValid) {
      if (!curr.value.is(Lexicon.Separator)) {
        list.push(curr.value);
      }
    }
    return list;
  };
  const nextStruct = (depoMode = false) => {
    builder.incrementIndentLevel();
    while (!nextToken().is(Lexicon.Denester)) {
      const name = curr.value; // TODO: Assert this is identifier.
      const setter = nextToken(); // TODO: Assert this is setter or required_setter.
      let required = depoMode; // All methods of a `depo` are required by default.
      switch (setter.kind) {
        case Lexicon.Setter:
          break;
        case Lexicon.RequiredSetter: {
          required = true;
          break;
        }
        default: {
          console.error(`Expected a setter, but got ${setter} instead.`); // TODO: Throw error.
        }
      }
      const token = nextToken();
      if (token.is(Lexicon.Nester)) {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        builder.appendProperty(name.value, required); // Omitting the type sets up for a nest.
        nextStruct();
      } else if (token.is(Lexicon.OpeningAngle)) {
        const [inputToken, outputToken] = nextList(
          true,
          2,
          Lexicon.ClosingAngle,
        );
        builder.appendMethod(
          name.value,
          {
            required,
            input: inputToken?.value,
            output: outputToken?.value,
          },
        );
      } else {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        builder.appendProperty(name.value, required, token.value);
      }
    }
    builder.decrementIndentLevel();
    builder.appendClosingStruct(depoMode);
  };
  while (!curr.done) {
    switch (curr.value.kind) {
      case Lexicon.ImpoDefiner: {
        const { value: filename } = nextToken();
        const dependencyTokens = nextList();
        const dependencies = dependencyTokens.map(({ value }) => value);
        builder.appendImport(filename, dependencies);
        break;
      }
      case Lexicon.TypeDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        builder.appendOpeningStruct(identifier.value);
        nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        nextStruct();
        break;
      }
      case Lexicon.DepoDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        builder.appendOpeningStruct(identifier.value);
        nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        const depoMode = true;
        nextStruct(depoMode);
        break;
      }
      default: {
        nextToken(); // TODO: Throw error (unexpected token).
      }
    }
  }
  return builder.export();
}
