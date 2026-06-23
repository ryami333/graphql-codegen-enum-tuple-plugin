import { createRequire } from "node:module";

import { defineConfig } from "vitest/config";

// graphql ships dual builds (CJS `index.js` + ESM `index.mjs`) with no `exports`
// conditions. Left alone, the tests' `import "graphql"` resolves to the ESM
// build while the plugin's `require("graphql")` resolves to the CJS build —
// producing two separate class "realms", so `isEnumType` (an `instanceof`
// check) fails with "another module or realm". Pinning the bare specifier to a
// single concrete file makes every import/require share one instance.
const graphqlEntry = createRequire(import.meta.url).resolve("graphql");

export default defineConfig({
  test: {
    server: {
      deps: {
        // Process graphql through Vite (rather than Node's externalized require)
        // so the alias below applies uniformly to the plugin's require.
        inline: ["graphql"],
      },
    },
  },
  resolve: {
    alias: {
      graphql: graphqlEntry,
    },
  },
});
