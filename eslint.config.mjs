import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import rnConfig from "@react-native-community/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      js,
      react: pluginReact,
      "react-hooks": pluginReactHooks
    },
    rules: {
      ...rnConfig.rules, // hereda las reglas de RN
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[optional=true]",
          message:
            "❌ No uses llamadas opcionales (fn?.()): Hermes/Metro no las soporta. Usa: if (fn) fn()"
        }
      ]
    }
  }
]);
