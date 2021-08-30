import type { TypeMap } from "./typemaps.ts";

export enum LanguageTarget {
  TypeScript = "ts",
  Go = "go",
  Basic = "bas",
  CPP = "cpp",
}

export enum Lexicon {
  Nester = "{",
  Denester = "}",
  OpeningAngle = "<",
  ClosingAngle = ">",
  Setter = ":",
  RequiredMarker = "*",
  TypeDefiner = "type",
  ImpoDefiner = "impo",
  Commenter = ";",
  Separator = ",",
  Spacer = " ",
  LineBreaker = "\n",
  LineBreaker2 = "\r",
  StringLiteral = "\`",
  EOF = "",
}

export enum IndentationSetting {
  Tab = "\t",
  SingleSpace = " ",
  DoubleSpace = "  ",
  TripleSpace = "   ",
  QuadrupleSpace = "    ",
}

export const TabIndentation = [
  "",
  "\t",
  "\t\t",
  "\t\t\t",
  "\t\t\t\t",
  "\t\t\t\t\t",
  "\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
  "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
] as const;

export const SingleSpaceIndentation = [
  "",
  " ",
  "  ",
  "   ",
  "    ",
  "     ",
  "      ",
  "       ",
  "        ",
  "         ",
  "          ",
  "           ",
  "            ",
  "             ",
  "              ",
  "               ",
] as const;

export const DoubleSpaceIndentation = [
  "",
  "  ",
  "    ",
  "      ",
  "        ",
  "          ",
  "            ",
  "              ",
  "                ",
  "                  ",
  "                    ",
  "                      ",
  "                        ",
  "                          ",
  "                            ",
  "                              ",
] as const;

export const TripleSpaceIndentation = [
  "",
  "   ",
  "      ",
  "         ",
  "            ",
  "               ",
  "                  ",
  "                     ",
  "                        ",
  "                           ",
  "                              ",
  "                                 ",
  "                                    ",
  "                                       ",
  "                                          ",
  "                                             ",
] as const;

export const QuadrupleSpaceIndentation = [
  "",
  "    ",
  "        ",
  "            ",
  "                ",
  "                    ",
  "                        ",
  "                            ",
  "                                ",
  "                                    ",
  "                                        ",
  "                                            ",
  "                                                ",
  "                                                    ",
  "                                                        ",
  "                                                            ",
] as const;

export interface FartSettings {
  target?: LanguageTarget;
  indentation?: string;
  typemap?: TypeMap;
}
