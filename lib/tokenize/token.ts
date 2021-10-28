import { LEXICON, Lexicon } from "../consts/lexicon.ts";
import { validateIdentifier, validateStringLiteral } from "./common.ts";

export class Token {
  public kind: Lexicon | null;
  constructor(
    private raw: string,
    public line: number,
    public column: number,
    noCheck = false,
  ) {
    this.kind = noCheck ? Lexicon.Identifier : Token.getKindOf(raw);
  }

  // deno-lint-ignore getter-return
  get value(): string {
    switch (this.kind) {
      case Lexicon.Identifier:
        return this.raw;
      case Lexicon.StringMarker:
      case Lexicon.StringMarker2:
      case Lexicon.StringMarker3:
      case Lexicon.StringLiteral: {
        const clean = (stringLiteral: string): string => {
          const marker = LEXICON[Lexicon.StringMarker];
          const pattern = new RegExp(`^\\${marker}|\\${marker}$`, "g");
          return stringLiteral.replace(pattern, "");
        };
        return clean(this.raw);
      }
      default: {
        if (this.kind !== null && LEXICON[this.kind] !== undefined) {
          return LEXICON[this.kind];
        }
        throw new Error(`Invalid token`);
      }
    }
  }

  is(kind: Lexicon | null): boolean {
    return this.kind === kind;
  }

  toString() {
    return this.value;
  }

  static getKindOf(raw: string): Lexicon | null {
    switch (raw) {
      case LEXICON[Lexicon.Nester]:
        return Lexicon.Nester;
      case LEXICON[Lexicon.Denester]:
        return Lexicon.Denester;
      case LEXICON[Lexicon.OpeningAngle]:
        return Lexicon.OpeningAngle;
      case LEXICON[Lexicon.ClosingAngle]:
        return Lexicon.ClosingAngle;
      case LEXICON[Lexicon.RequiredMarker]:
        return Lexicon.RequiredMarker;
      case LEXICON[Lexicon.Setter]:
        return Lexicon.Setter;
      case LEXICON[Lexicon.RequiredSetter]:
        return Lexicon.RequiredSetter;
      case LEXICON[Lexicon.TypeDefiner]:
        return Lexicon.TypeDefiner;
      case LEXICON[Lexicon.DepoDefiner]:
        return Lexicon.DepoDefiner;
      case LEXICON[Lexicon.LoadDefiner]:
        return Lexicon.LoadDefiner;
      case LEXICON[Lexicon.Commenter]:
        return Lexicon.Commenter;
      case LEXICON[Lexicon.Separator]:
        return Lexicon.Separator;
      case LEXICON[Lexicon.Spacer]:
        return Lexicon.Spacer;
      case LEXICON[Lexicon.LineBreaker]:
        return Lexicon.LineBreaker;
      case LEXICON[Lexicon.LineBreaker2]:
        return Lexicon.LineBreaker2;
      case LEXICON[Lexicon.Modifier]:
        return Lexicon.Modifier;
      case LEXICON[Lexicon.EOF]:
        return Lexicon.EOF;
      default: {
        if (validateIdentifier(raw)) return Lexicon.Identifier;
        else if (validateStringLiteral(raw)) return Lexicon.StringLiteral;
        else return Lexicon.Comment; // Invalid token is treated as comment.
      }
    }
  }
}
