import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["dist/*", "node_modules/*", "src/polyfills/*"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // TODO: We need to fix issues related to these rules and remove them
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
      "no-prototype-builtins": "off",
      "no-var": "off",
      "no-case-declarations": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-useless-escape": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  eslintConfigPrettier,
]
