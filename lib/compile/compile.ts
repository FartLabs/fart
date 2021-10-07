import { Token, tokenize } from "../tokenize/mod.ts";
import { Lexicon } from "../consts/lexicon.ts";
import { INDENT, Indent } from "../consts/indent.ts";
import { Builder } from "../gen/builder.ts";
import type { Cart } from "../gen/cart.ts";
import type { TypeMap } from "../typemap/mod.ts";

export interface CompilationSettings {
  cartridge: Cart;
  typemap: TypeMap;
  indentation?: string;
}

/**
 * Side-Effect: Infers omitted settings.
 */
export function validateCompilationSettings(
  settings: CompilationSettings,
): Required<CompilationSettings> {
  return {
    cartridge: settings.cartridge,
    typemap: settings.typemap,
    indentation: settings.indentation ?? INDENT[Indent.Space2],
  };
}

export function compile(
  content: string,
  settings: CompilationSettings,
): string {
  const { cartridge, typemap, indentation } = validateCompilationSettings(
    settings,
  );
  const builder = new Builder(cartridge, typemap, indentation);

  const it = tokenize(content);
  let curr: IteratorResult<Token, Token> = it.next();

  const nextToken = (): Token => (curr = it.next()).value;

  const nextTuple = (
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
        const [inputToken, outputToken] = nextTuple(
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
        const dependencyTokens = nextTuple();
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
