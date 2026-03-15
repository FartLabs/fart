---
self_link: https://fart.fart.tools/getting-started
---

# Getting Started

Welcome to Fart! This guide will help you get up and running with the Fart infrastructure.

## Prerequisites

Before using Fart, ensure you have Deno installed. We recommend using the latest version of Deno to ensure compatibility with our transpiler options and server configurations.

- [Install Deno](https://docs.deno.com/runtime/manual/getting_started/installation)

## Basic Usage

You can write Fart code using `.fart` source files. By default, Fart tokenizes and transpiles the syntax into usable JavaScript/TypeScript types. 

A simple type definition in Fart looks like this:
```fart
type User {
  id: string
  name: string
  age?: number
}
```

The transpiler takes this source and emits language-specific output via `Cartridge` plugins.

## Core Concepts

- **Tokenization**: The lexicon maps source syntax to a list of tokens.
- **Transpilation**: The core AST event dispatcher that converts tokens into code strings.
- **Cartridges**: Language targets that define how specific structures and keywords map to other languages.

We plan to expand this guide with specific toolchain examples and more advanced Fart syntax in the future!
