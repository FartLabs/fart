import { LEXICON, Lexicon } from "./lexicon.ts";

export const findInLexicon = (raw: string): Lexicon | null => {
  for (const [kind, value] of LEXICON) {
    if ((Array.isArray(value) && value.includes(raw) || (raw === value))) {
      return kind;
    }
  }
  return null;
};

export const checkIsIdentifier = (candidate: string): boolean =>
  /^[a-zA-Z_$]\.*[a-zA-Z_$0-9]*$/g.test(candidate);

export const checkIsTextLiteral = (candidate: string): boolean =>
  /^\`(.*?)\`$/g.test(candidate) ||
  /^\'(.*?)\'$/g.test(candidate) ||
  /^\"(.*?)\"$/g.test(candidate);
