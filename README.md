# graphql-codegen-enum-tuple-plugin

A [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) plugin that emits each GraphQL enum as a **readonly tuple of its member names**.

This is designed to run **alongside** the first-class Codegen plugins — [`client-preset`](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client), [`typescript`](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript), and [`typescript-operations`](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations) — not as a replacement for them. Those plugins already generate the **types** for your enums. What none of them give you is the enum's members as a value you can read at runtime: a real array to iterate, map over, validate against, or feed into a `<select>`. This plugin fills that gap.

## Example

Given this schema:

```graphql
enum Color {
  RED
  GREEN
  BLUE
}

enum Size {
  SMALL
  LARGE
}
```

The plugin generates:

```ts
export const colorValues = ["BLUE", "GREEN", "RED"] as const;

export const sizeValues = ["LARGE", "SMALL"] as const;
```

Which gives you the members as runtime values:

```ts
import { colorValues } from "./generated/enum-tuples";

// Iterate, render, validate — all at runtime
colorValues.forEach((color) => console.log(color));
const isColor = (value: string) => colorValues.includes(value);
```

The tuple is emitted `as const`, so it stays precisely typed (`readonly ["BLUE", "GREEN", "RED"]`) and composes with the enum types your `typescript` / `typescript-operations` / `client-preset` output already provides — but generating those types isn't this plugin's job.

> **Note:** Both the enum types and their members are emitted in alphabetical order, so the output is deterministic regardless of how the schema is written. GraphQL introspection enums (`__TypeKind`, `__DirectiveLocation`, etc.) are skipped.

## Installation

Install the plugin alongside GraphQL Code Generator and its peer dependencies:

```bash
# npm
npm install --save-dev graphql-codegen-enum-tuple-plugin

# yarn
yarn add --dev graphql-codegen-enum-tuple-plugin

# pnpm
pnpm add --save-dev graphql-codegen-enum-tuple-plugin
```

### Peer dependencies

This plugin relies on the following being present in your project (they usually already are if you use GraphQL Codegen):

| Package                           | Supported versions      |
| --------------------------------- | ----------------------- |
| `graphql`                         | `^14 \|\| ^15 \|\| ^16` |
| `@graphql-codegen/plugin-helpers` | `^5 \|\| ^6 \|\| ^7`    |

You'll also need the Codegen CLI (`@graphql-codegen/cli`) to actually run the generation.

## Configuration

Add the plugin to a generated output in your `codegen.ts` (or `codegen.yml`):

```ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  generates: {
    "./src/generated/enum-tuples.ts": {
      plugins: ["graphql-codegen-enum-tuple-plugin"],
    },
  },
};

export default config;
```

Then run Codegen as usual:

```bash
npx graphql-codegen
```

### Options

The plugin builds each constant's name as `` `${tuplePrefix}${TypeName}${tupleSuffix}` ``. Both options are optional.

| Option        | Type     | Default    | Description                                    |
| ------------- | -------- | ---------- | ---------------------------------------------- |
| `tuplePrefix` | `string` | `""`       | String prepended to each generated const name. |
| `tupleSuffix` | `string` | `"Values"` | String appended to each generated const name.  |

#### Examples

```ts
"./src/generated/enum-tuples.ts": {
  plugins: ["graphql-codegen-enum-tuple-plugin"],
  config: {
    tuplePrefix: "enum",
    tupleSuffix: "Tuple",
  },
},
```

## License

[MIT](./LICENSE)
