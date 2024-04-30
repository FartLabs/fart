/**
 * Enum containing all possible combinations of tabbed, single-spaced,
 * double-spaced, triple-spaced, and quadruple-spaced indentations.
 */
export enum Indent {
  Tab1 = -1,
  Tab2 = -2,
  Tab3 = -3,
  Tab4 = -4,
  Tab5 = -5,
  Tab6 = -6,
  Tab7 = -7,
  Tab8 = -8,
  Tab9 = -9,
  Tab10 = -10,
  Tab11 = -11,
  Tab12 = -12,
  Tab13 = -13,
  Tab14 = -14,
  Tab15 = -15,
  Tab16 = -16,
  Space0 = 0,
  Space1 = 1,
  Space2 = 2,
  Space3 = 3,
  Space4 = 4,
  Space5 = 5,
  Space6 = 6,
  Space7 = 7,
  Space8 = 8,
  Space9 = 9,
  Space10 = 10,
  Space11 = 11,
  Space12 = 12,
  Space13 = 13,
  Space14 = 14,
  Space15 = 15,
  Space16 = 16,
  Space18 = 18,
  Space20 = 20,
  Space21 = 21,
  Space22 = 22,
  Space24 = 24,
  Space26 = 26,
  Space27 = 27,
  Space28 = 28,
  Space30 = 30,
  Space32 = 32,
  Space33 = 33,
  Space36 = 36,
  Space39 = 39,
  Space40 = 40,
  Space42 = 42,
  Space44 = 44,
  Space45 = 45,
  Space48 = 48,
  Space52 = 52,
  Space56 = 56,
  Space60 = 60,
}

export type IndentOption =
  | Indent.Tab1
  | Indent.Space1
  | Indent.Space2
  | Indent.Space3
  | Indent.Space4;

export const INDENT = {
  [Indent.Tab1]: "\t",
  [Indent.Tab2]: "\t\t",
  [Indent.Tab3]: "\t\t\t",
  [Indent.Tab4]: "\t\t\t\t",
  [Indent.Tab5]: "\t\t\t\t\t",
  [Indent.Tab6]: "\t\t\t\t\t\t",
  [Indent.Tab7]: "\t\t\t\t\t\t\t",
  [Indent.Tab8]: "\t\t\t\t\t\t\t\t",
  [Indent.Tab9]: "\t\t\t\t\t\t\t\t\t",
  [Indent.Tab10]: "\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab11]: "\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab12]: "\t\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab13]: "\t\t\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab14]: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab15]: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Tab16]: "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t",
  [Indent.Space0]: "",
  [Indent.Space1]: " ",
  [Indent.Space2]: "  ",
  [Indent.Space3]: "   ",
  [Indent.Space4]: "    ",
  [Indent.Space5]: "     ",
  [Indent.Space6]: "      ",
  [Indent.Space7]: "       ",
  [Indent.Space8]: "        ",
  [Indent.Space9]: "         ",
  [Indent.Space10]: "          ",
  [Indent.Space11]: "           ",
  [Indent.Space12]: "            ",
  [Indent.Space13]: "             ",
  [Indent.Space14]: "              ",
  [Indent.Space15]: "               ",
  [Indent.Space16]: "                ",
  [Indent.Space18]: "                  ",
  [Indent.Space20]: "                    ",
  [Indent.Space21]: "                     ",
  [Indent.Space22]: "                      ",
  [Indent.Space24]: "                        ",
  [Indent.Space26]: "                          ",
  [Indent.Space27]: "                           ",
  [Indent.Space28]: "                            ",
  [Indent.Space30]: "                              ",
  [Indent.Space32]: "                                ",
  [Indent.Space33]: "                                 ",
  [Indent.Space36]: "                                    ",
  [Indent.Space39]: "                                       ",
  [Indent.Space40]: "                                        ",
  [Indent.Space42]: "                                          ",
  [Indent.Space44]: "                                            ",
  [Indent.Space45]: "                                             ",
  [Indent.Space48]: "                                                ",
  [Indent.Space52]: "                                                    ",
  [Indent.Space56]: "                                                        ",
  [Indent.Space60]:
    "                                                            ",
} as const;

export type IndentCacheIndex = keyof typeof INDENT;