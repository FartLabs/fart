import { tokenize } from "./tokenize.ts";
import { Lexicon } from "./types.ts";
import { CodeDocument } from "./code-document.ts";
import { validateSettings } from "./utils.ts";
import { FartSettings, LanguageTarget } from "./types.ts";
import type { CodeTemplate } from "./code-templates/types.ts";
import { validateIdentifier } from "./utils.ts";
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
  let curr: IteratorResult<string, string> = it.next();
  const nextToken = (): string => (curr = it.next()).value;
  const nextList = (
    ateFirstToken = false,
    maxLength?: number,
    closingToken: string = Lexicon.Denester,
  ): string[] => {
    if (!ateFirstToken) nextToken(); // TODO: Assert this token === openingToken.
    const list: string[] = [];
    const isLengthValid = maxLength === undefined || maxLength >= list.length;
    while (nextToken() !== closingToken && isLengthValid) {
      if (curr.value !== Lexicon.Separator) {
        list.push(curr.value);
      }
    }
    return list;
  };
  const nextStruct = (depoMode: boolean = false) => {
    document.incrementIndentationLevel();
    while (nextToken() !== Lexicon.Denester) {
      const name = curr.value;
      const setter = nextToken();
      let required = depoMode; // All methods of a `depo` are required by default.
      switch (setter) {
        case Lexicon.Setter:
          break;
        case Lexicon.RequiredMarker + Lexicon.Setter:
          required = true;
          break;
        default:
          console.error(`Expected a setter, but got ${setter} instead.`); // TODO: Throw error.
      }
      const token = nextToken();
      if (token === Lexicon.Nester) {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        document.addProperty(name, required); // Omitting the type sets up for a nest.
        nextStruct();
      } else if (token === Lexicon.OpeningAngle) {
        const [inputToken, outputToken] = nextList(
          true,
          2,
          Lexicon.ClosingAngle,
        );
        document.addMethod(name, required, inputToken, outputToken);
      } else if (validateIdentifier(token)) {
        if (depoMode) {
          // TODO: Throw warning (depos only register methods).
          continue;
        }
        document.addProperty(name, required, token);
      }
    }
    document.decrementIndentationLevel();
    document.closeStruct();
  };
  const quotePattern = new RegExp(Lexicon.StringLiteral, "g");
  while (!curr.done) {
    switch (curr.value) {
      case Lexicon.ImpoDefiner: {
        const filename = nextToken().replace(quotePattern, ""); // Remove quotes.
        const dependencyList = nextList();
        document.addImport(filename, dependencyList);
        break;
      }
      case Lexicon.TypeDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        document.addStruct(identifier);
        nextToken(); // TODO: Assert this token === Lexicon.Nester.
        nextStruct();
        break;
      }
      case Lexicon.DepoDefiner: {
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        document.addStruct(identifier);
        nextToken(); // TODO: Assert this token === Lexicon.Nester.
        const depoMode = true;
        nextStruct(depoMode);
        break;
      }
      default: {
        nextToken(); // TODO: Throw error for unexpected token.
      }
    }
  }
  return document.compile();
}
