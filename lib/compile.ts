import { Token, tokenize } from "./tokenize.ts";
import { Lexicon } from "./constants/lexicon.ts";
import { CodeDocument } from "./code-document.ts";
import { validateSettings } from "./utils.ts";
import { FartSettings, LanguageTarget } from "./types.ts";
import type { CodeTemplate } from "./code-templates/types.ts";
import { TypeMap, TYPEMAPS } from "./typemaps.ts";

import { GoCodeTemplate } from "./code-templates/go-code-template.ts";
import { QB64CodeTemplate } from "./code-templates/qb64-code-template.ts";
import { DenoTypeScriptCodeTemplate } from "./code-templates/deno-typescript-code-template.ts";

const determineCodeTemplate = (target: LanguageTarget): CodeTemplate => {
  switch (target) {
    case LanguageTarget.Basic:
      return QB64CodeTemplate;
    case LanguageTarget.Go:
      return GoCodeTemplate;
    case LanguageTarget.TypeScript:
    default:
      return DenoTypeScriptCodeTemplate;
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
  const codeTemplate = determineCodeTemplate(validatedSettings.target);
  const typemap = determineTypeMap(validatedSettings.target);
  const document = new CodeDocument(
    codeTemplate,
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
    document.incrementIndentationLevel();
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
        document.addProperty(name.value, required); // Omitting the type sets up for a nest.
        nextStruct();
      } else if (token.is(Lexicon.OpeningAngle)) {
        const [inputToken, outputToken] = nextList(
          true,
          2,
          Lexicon.ClosingAngle,
        );
        document.addMethod(
          name.value,
          required,
          inputToken?.value,
          outputToken?.value,
        );
      } else {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        document.addProperty(name.value, required, token.value);
      }
    }
    document.decrementIndentationLevel();
    document.closeStruct();
  };
  while (!curr.done) {
    switch (curr.value.kind) {
      case Lexicon.ImpoDefiner: {
        const { value: filename } = nextToken();
        const dependencyList = nextList();
        document.addImport(filename, dependencyList.map(({ value }) => value));
        break;
      }
      case Lexicon.TypeDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        document.addStruct(identifier.value);
        nextToken(); // TODO: Assert this token.is(Lexicon.Nester).
        nextStruct();
        break;
      }
      case Lexicon.DepoDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        document.addStruct(identifier.value);
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
  return document.compile();
}
