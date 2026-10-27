// @ts-check

import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import pluginJs from "@eslint/js";
import { globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfigWithVueTs(
  pluginVue.configs["flat/recommended"],
  pluginJs.configs.recommended,
  vueTsConfigs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "vue/no-deprecated-slot-attribute": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // RouterLink is used inline in text like <a>, which the rule already ignores.
      "vue/singleline-html-element-content-newline": ["warn", { externalIgnores: ["RouterLink"] }],
    },
  },
  {
    files: ["src/pages/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  globalIgnores(["coverage", "dist"]),
);
