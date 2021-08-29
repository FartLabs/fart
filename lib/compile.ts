import { tokenize } from "./tokenize.ts";
import { IndentationSetting, Lexicon } from "./types.ts";
import { CodeDocument } from "./code-document.ts";
import { validateSettings } from "./utils.ts";
import { FartSettings, LanguageTarget } from "./types.ts";
import { CodeTemplate } from "./code-templates/types.ts";
import { DenoTypeScriptCodeTemplate } from "./code-templates/deno-typescript-code-template.ts";
import { validateIdentifier } from "./utils.ts";

const determineCodeTemplate = (target: LanguageTarget) => {
  switch (target) {
    case LanguageTarget.TypeScript:
    default:
      return DenoTypeScriptCodeTemplate;
  }
};

export function compile(content: string, settings?: FartSettings): string {
  const validatedSettings = validateSettings(settings);
  const codeTemplate = determineCodeTemplate(validatedSettings.target);
  const document = new CodeDocument(
    codeTemplate,
    validatedSettings.indentation,
  );
  const it = tokenize(content);
  let curr: IteratorResult<string, string> = it.next();
  const nextToken = (): string => (curr = it.next()).value;
  const nextList = (
    ateFirstToken: boolean = false,
    maxLength?: number,
  ): string[] => {
    if (!ateFirstToken) nextToken(); // TODO: Assert this token === Lexicon.Nester.
    const list: string[] = [];
    const checkLengthIsOk =
      () => (maxLength === undefined || maxLength >= list.length);
    while (nextToken() !== Lexicon.Denester && checkLengthIsOk()) {
      if (curr.value !== Lexicon.Separator) {
        list.push(curr.value);
      }
    }
    return list;
  };
  const nextStruct = () => {
    document.incrementIndentationLevel();
    while (nextToken() !== Lexicon.Denester) {
      const name = curr.value;
      const setter = nextToken();
      let required: boolean = false;
      switch (setter) {
        case Lexicon.Setter:
          required = false;
          break;
        case Lexicon.RequiredSetter:
          required = true;
          break;
        default:
          console.error(`Expected a setter, but got ${setter} instead.`); // TODO: Throw error.
      }
      const token = nextToken();
      if (token === Lexicon.Nester) {
        document.addProperty(name, required); // Omitting the type sets up for a nest.
        nextStruct();
        // TODO: Implement method compilation.
        // } else if (token === Lexicon.OpenAngle) {
        //   const [inputToken, outputToken] = nextList(true, 2, Lexicon.OpenAngle, Lexicon.CloseAngle);
        //   document.addMethod(name, required, inputToken, outputToken);
      } else if (validateIdentifier(token)) {
        document.addProperty(name, required, token);
      }
    }
    document.decrementIndentationLevel();
    document.closeStruct();
  };
  while (!curr.done) {
    switch (curr.value) {
      case Lexicon.ImpoDefiner:
        const filename = nextToken();
        const dependencyList = nextList();
        document.addImport(filename, dependencyList);
        break;
      case Lexicon.TypeDefiner:
        const identifier = nextToken(); // TODO: Assert is valid identifier.
        document.addStruct(identifier);
        nextToken(); // TODO: Assert this token === Lexicon.Nester.
        nextStruct();
      default:
        const unexpectedToken = nextToken();
        console.error({ unexpectedToken }); // TODO: Throw error for unexpected token.
    }
  }
  return document.compile();
}
