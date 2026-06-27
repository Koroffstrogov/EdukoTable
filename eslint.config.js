import js from "@eslint/js";
import tseslint from "typescript-eslint";

const browserGlobals = {
  document: "readonly",
  localStorage: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    languageOptions: {
      globals: browserGlobals,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
    },
  },
];
