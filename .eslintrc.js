module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true,
  },
  plugins: ["@typescript-eslint", "jest", "import"],
  extends: ["@react-native-community", "plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "prettier/prettier": "error",
    quotes: [2, "double", { avoidEscape: true }],
    "@typescript-eslint/no-shadow": ["error"],
    "no-shadow": "off",
    "no-undef": "off",
    "no-restricted-imports": ["error", { patterns: ["@/features/*/*"] }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "import/no-unresolved": "off",
      },
    },
    {
      files: ["jest.setup.js"],
      parserOptions: {
        project: null,
      },
    },
  ],
};
