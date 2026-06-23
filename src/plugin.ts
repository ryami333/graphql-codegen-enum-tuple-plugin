import type { CodegenPlugin } from "@graphql-codegen/plugin-helpers";
import { isEnumType } from "graphql";

export interface EnumTuplesPluginConfig {
  /**
   * String prepended to each generated const name. Defaults to `""`. When set,
   * the enum's type name keeps its original casing so it reads as camelCase
   * (e.g. `tuplePrefix: "enum"` → `enumAbteilungTypeValues`).
   */
  tuplePrefix?: string;
  /** String appended to each generated const name. Defaults to `"Values"`. */
  tupleSuffix?: string;
}

const enumTuplesPlugin: CodegenPlugin<EnumTuplesPluginConfig> = {
  plugin: (schema, _documents, config) => {
    const { tuplePrefix = "", tupleSuffix = "Values" } = config;

    const enumTypes = Object.values(schema.getTypeMap())
      .filter(isEnumType)
      // Skip introspection enums (__TypeKind, __DirectiveLocation, …).
      .filter((type) => !type.name.startsWith("__"))
      .sort((a, b) => a.name.localeCompare(b.name));

    return enumTypes
      .map((type) => {
        // With no prefix the leading character is lowercased; with a prefix the
        // type name keeps its casing so it joins in camelCase.
        const typePart = tuplePrefix
          ? type.name
          : type.name.charAt(0).toLowerCase() + type.name.slice(1);
        const constName = tuplePrefix + typePart + tupleSuffix;
        const members = type
          .getValues()
          .map((value) => value.name)
          .sort((a, b) => a.localeCompare(b))
          .map((name) => JSON.stringify(name));

        return `export const ${constName} = [${members.join(", ")}] as const;`;
      })
      .join("\n\n");
  },
};

export default enumTuplesPlugin;
