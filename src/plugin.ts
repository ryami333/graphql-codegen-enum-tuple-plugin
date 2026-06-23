import type { CodegenPlugin } from "@graphql-codegen/plugin-helpers";
import { isEnumType } from "graphql";

/**
 * Emits each GraphQL enum as a readonly tuple of its member names, e.g.
 * `export const abteilungTypeValues = ["JUGENDHILFE", "MIGRATION"] as const;`.
 */
const enumTuplesPlugin: CodegenPlugin = {
  plugin: (schema) =>
    Object.values(schema.getTypeMap())
      .filter(isEnumType)
      // Skip introspection enums (__TypeKind, __DirectiveLocation, …).
      .filter((type) => !type.name.startsWith("__"))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((type) => {
        const constName =
          type.name.charAt(0).toLowerCase() + type.name.slice(1) + "Values";
        const members = type
          .getValues()
          .map((value) => value.name)
          .sort((a, b) => a.localeCompare(b))
          .map((name) => JSON.stringify(name))
          .join(", ");
        return `export const ${constName} = [${members}] as const;`;
      })
      .join("\n\n"),
};

export default enumTuplesPlugin;
