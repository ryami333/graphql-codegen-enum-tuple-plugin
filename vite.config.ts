import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    // This is a build-time dependency, so bundle size is irrelevant; keep the
    // output readable (and avoid minifier-introduced modern syntax on older
    // Node runtimes) and ship a sourcemap for easier debugging.
    minify: false,
    sourcemap: true,
    // graphql-codegen loads plugins via CommonJS `require`, so emit a single
    // CommonJS file regardless of the ESM source.
    lib: {
      entry: "src/plugin.ts",
      formats: ["cjs"],
      fileName: () => "plugin.cjs",
    },
    rollupOptions: {
      // Don't bundle peer dependencies; the consuming project provides them.
      external: ["graphql", "@graphql-codegen/plugin-helpers"],
    },
  },
});
