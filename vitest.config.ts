import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Process graphql through Vite (rather than Node's externalized require) so
    // the alias below applies uniformly to the plugin's `require("graphql")`.
    server: {
      deps: {
        inline: ["graphql"],
      },
    },
  },
  resolve: {
    // graphql ships dual builds (CJS `index.js` + ESM `index.mjs`) with no
    // `exports` conditions. Left alone, the tests' `import "graphql"` resolves
    // to the ESM build while the plugin's `require("graphql")` resolves to the
    // CJS build — producing two separate class "realms", so `isEnumType` (an
    // `instanceof` check) fails with "another module or realm". Pinning the
    // bare specifier to one concrete file makes everything share one instance.
    alias: [{ find: /^graphql$/, replacement: "graphql/index.js" }],
  },
});
