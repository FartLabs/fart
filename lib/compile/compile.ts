import { Token, tokenize } from "../tokenize/mod.ts";
import { Lexicon } from "../consts/lexicon.ts";
import { INDENT, Indent } from "../consts/indent.ts";
import { Builder } from "../gen/builder.ts";
import type { Cart } from "../gen/cart.ts";
import { ModifierType, TypeMap, TypeModifier } from "../gen/typemap.ts";

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

export async function compile(
  content: string,
  settings: CompilationSettings,
): Promise<string> {
  const { cartridge, typemap, indentation } = validateCompilationSettings(
    settings,
  );
  const builder = new Builder(cartridge, typemap, indentation);

  const it = tokenize(content);
  let curr: IteratorResult<Token, Token> = it.next();

  const applyMods = (
    tokens: Token[],
    ...mods: ModifierType[]
  ): string | undefined =>
    mods.reduceRight((result, mod) => {
      if (typemap !== undefined && typemap[mod] !== undefined) {
        return [(typemap[mod] as TypeModifier)(...result)];
      }
      return result;
    }, tokens.map(({ value }) => value)).pop();

  const checkModExists = (identifier: string) =>
    (Object.values(ModifierType) as string[]).includes(identifier);

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
        const modifiedValue = nextModifier(curr.value);
        if (modifiedValue !== undefined) {
          list.push(
            new Token(
              modifiedValue,
              curr.value.line,
              curr.value.column,
              /*noCheck=*/ true,
            ),
          );
        } else {
          list.push(curr.value);
        }
      }
    }
    return list;
  };

  const nextStruct = async (depoMode = false) => {
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
        // console.log("EMPTY_PROP", { token });
        await builder.appendProperty(name.value, required); // Omitting the type sets up for a nest.
        await nextStruct();
      } else if (token.is(Lexicon.OpeningAngle)) {
        const [inputToken //, outputToken
        ] = nextTuple(
          true,
          2,
          Lexicon.ClosingAngle,
        );
        await builder.appendProperty(
          name.value,
          required,
          inputToken.value,
          true,
          false,
          /*mods=[]*/
        );
      } else {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        await builder.appendProperty(
          name.value,
          required,
          nextModifier(token) ?? token.value,
        );
      }
    }
    builder.decrementIndentLevel();
    await builder.appendClosingStruct();
  };

  const nextModifier = (
    currentToken: Token,
  ): string | undefined => {
    const mods: ModifierType[] = [];
    while (checkModExists(currentToken.value)) {
      mods.push(currentToken.value as ModifierType);
      nextToken(); // TODO: Assert this is modifier (%)
      currentToken = nextToken();
    }
    const tokens = [];
    if (currentToken.is(Lexicon.OpeningAngle)) {
      tokens.push(...nextTuple(
        true,
        2,
        Lexicon.ClosingAngle,
      ));
    } else {
      tokens.push(currentToken);
    }
    return applyMods(tokens, ...mods);
  };

  while (!curr.done) {
    switch (curr.value.kind) {
      case Lexicon.ImpoDefiner: {
        const { value: filename } = nextToken();
        const dependencyTokens = nextTuple();
        const dependencies = dependencyTokens.map(({ value }) => value);
        await builder.appendImport(filename, dependencies);
        break;
      }
      case Lexicon.TypeDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        await builder.appendOpeningStruct(identifier.value);
        nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        await nextStruct();
        break;
      }
      case Lexicon.DepoDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        await builder.appendOpeningStruct(identifier.value);
        nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        const depoMode = true;
        await nextStruct(depoMode);
        break;
      }
      default: {
        nextToken(); // TODO: Throw error (unexpected token).
      }
    }
  }

  // console.log("BLOCKS", builder.blocks);
  return builder.export();
}
