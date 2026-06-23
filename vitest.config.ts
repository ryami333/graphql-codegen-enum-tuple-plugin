import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // graphql 14 and 15 ship an ESM entry (`module: index.mjs`) that uses
    // extensionless relative imports (e.g. `import { version } from './version'`)
    // and no `exports` map. Vitest resolves that entry but Node's native ESM
    // resolver can't follow the extensionless paths, so importing `graphql`
    // throws "Cannot find module .../graphql/version". Pinning the import to the
    // CommonJS entry (`index.js`, which uses `require`) sidesteps the problem
    // across all supported graphql versions; this is also how the published
    // plugin consumes graphql (its `main` is a CJS bundle).
    alias: {
      graphql: "graphql/index.js",
    },
  },
});
