import { buildSchema } from "graphql";
import { describe, expect, it } from "vitest";

import enumTuplesPlugin from "./plugin.cjs";

/**
 * Helper that builds an in-memory schema from SDL and runs the plugin against
 * it, exactly as graphql-codegen would at generation time — no `codegen.ts`
 * config or file I/O required.
 */
function generate(sdl: string): string {
  const schema = buildSchema(sdl);
  const output = enumTuplesPlugin.plugin(schema, [], {});
  // The CodegenPlugin contract allows a string, a structured object, or a
  // promise; this plugin always returns a plain string synchronously, so narrow
  // to that (and fail loudly if the contract ever changes).
  if (typeof output !== "string") {
    throw new Error("Expected the plugin to return a string");
  }
  return output;
}

describe("enumTuplesPlugin", () => {
  it("emits an enum as a readonly tuple of its member names", () => {
    expect(
      generate(`
        enum AbteilungType {
          JUGENDHILFE
          MIGRATION
        }
      `),
    ).toBe(
      `export const abteilungTypeValues = ["JUGENDHILFE", "MIGRATION"] as const;`,
    );
  });

  it("lowercases the first character of the const name", () => {
    expect(generate(`enum Color { RED }`)).toBe(
      `export const colorValues = ["RED"] as const;`,
    );
  });

  it("sorts member names alphabetically", () => {
    expect(generate(`enum Color { RED GREEN BLUE }`)).toBe(
      `export const colorValues = ["BLUE", "GREEN", "RED"] as const;`,
    );
  });

  it("sorts multiple enums alphabetically by type name, separated by a blank line", () => {
    expect(
      generate(`
        enum Zebra { A }
        enum Apple { B }
      `),
    ).toBe(
      [
        `export const appleValues = ["B"] as const;`,
        `export const zebraValues = ["A"] as const;`,
      ].join("\n\n"),
    );
  });

  it("skips introspection enums (__TypeKind, __DirectiveLocation, …)", () => {
    // A schema with no user-defined enums must yield an empty string, proving
    // the built-in introspection enums are filtered out.
    expect(generate(`type Query { hello: String }`)).toBe("");
  });
});
