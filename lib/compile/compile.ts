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
    mods.reduceRight(
      (result, mod) => {
        if (typemap !== undefined && typemap[mod] !== undefined) {
          return [(typemap[mod] as TypeModifier)(...result)];
        }
        return result;
      },
      tokens.map(({ value }) => builder.getType(value) ?? value),
    ).pop();

  const checkModExists = (identifier: string) =>
    (Object.values(ModifierType) as string[]).includes(identifier);

  const nextToken = async (): Promise<Token> => {
    while ((curr = it.next()).value.kind === Lexicon.Comment) {
      const { value, line, column } = curr.value;
      await builder.appendComment(value, line, column);
    }
    return curr.value;
  };

  const nextTuple = async (
    ateFirstToken = false,
    maxLength?: number,
    closingToken: Lexicon = Lexicon.Denester,
  ): Promise<Token[]> => {
    if (!ateFirstToken) await nextToken(); // TODO: Assert this token === openingToken.
    const list: Token[] = [];
    const isLengthValid = maxLength === undefined || maxLength >= list.length;
    while (!(await nextToken()).is(closingToken) && isLengthValid) {
      if (!curr.value.is(Lexicon.Separator)) {
        const modifiedValue = await nextModifier(curr.value);
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
    while (!(await nextToken()).is(Lexicon.Denester)) {
      const name = curr.value; // TODO: Assert this is identifier.
      const setter = await nextToken(); // TODO: Assert this is setter or required_setter.
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
      const token = await nextToken();
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
        ] = await nextTuple(
          true,
          16,
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
        const isMethod = token.value.startsWith(ModifierType.Function);
        await builder.appendProperty(
          name.value,
          required,
          await nextModifier(token) ?? token.value,
          isMethod,
        );
      }
    }
    builder.decrementIndentLevel();
    await builder.appendClosingStruct();
  };

  const nextModifier = async (
    currentToken: Token,
  ): Promise<string | undefined> => {
    const mods: ModifierType[] = [];
    while (checkModExists(currentToken.value)) {
      mods.push(currentToken.value as ModifierType);
      await nextToken(); // TODO: Assert this is modifier (%)
      currentToken = await nextToken();
    }
    const tokens = [];
    if (currentToken.is(Lexicon.OpeningAngle)) {
      tokens.push(
        ...await nextTuple(
          true,
          2,
          Lexicon.ClosingAngle,
        ),
      );
    } else {
      tokens.push(currentToken);
    }
    return applyMods(tokens, ...mods);
  };

  while (!curr.done) {
    switch (curr.value.kind) {
      case Lexicon.LoadDefiner: {
        const { value: filename } = await nextToken();
        const dependencyTokens = await nextTuple();
        const dependencies = dependencyTokens.map(({ value }) => value);
        await builder.appendImport(filename, dependencies);
        break;
      }
      case Lexicon.TypeDefiner: {
        const identifier = await nextToken(); // TODO: Assert is valid identifier.
        await builder.appendOpeningStruct(identifier.value);
        await nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        await nextStruct();
        break;
      }
      case Lexicon.DepoDefiner: {
        const identifier = await nextToken(); // TODO: Assert is valid identifier.
        await builder.appendOpeningStruct(identifier.value);
        await nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        const depoMode = true;
        await nextStruct(depoMode);
        break;
      }
      default: {
        await nextToken(); // TODO: Throw error (unexpected token).
      }
    }
  }

  // console.log("BLOCKS", builder.blocks);
  return builder.export();
}
