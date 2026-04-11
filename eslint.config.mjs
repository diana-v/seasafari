import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [".next/", "out/", "build/", "coverage/", "public/", "sanity/"]
    },
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    unicorn.configs["flat/recommended"],
    perfectionist.configs["recommended-natural"],
    {
        files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "@next/next": nextPlugin,
            "react": reactPlugin,
            "react-hooks": hooksPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs["jsx-runtime"].rules,
            ...hooksPlugin.configs.recommended.rules,
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,

            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "warn",
            "padding-line-between-statements": [
                "error",
                { "blankLine": "always", "next": "*", "prev": ["const", "let", "var"] },
                { "blankLine": "any", "next": ["const", "let", "var"], "prev": ["const", "let", "var"] },
                { "blankLine": "always", "next": ["return", "export"], "prev": "*" }
            ],
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "unicorn/filename-case": [
                "error",
                {
                    "cases": {
                        "camelCase": true,
                        "kebabCase": true,
                        "pascalCase": true
                    }
                }
            ],
            "unicorn/no-null": "off",
            "unicorn/prevent-abbreviations": "off",
        },
        settings: {
            react: { version: "detect" },
        },
    },
    prettierConfig
);
