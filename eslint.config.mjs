import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['**/android/', 'babel.config.js']),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'global-require': 'off',
      'no-console': 'off',
      'no-use-before-define': 'off',

      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          variables: false,
        },
      ],

      '@typescript-eslint/comma-dangle': 'off',
      'implicit-arrow-linebreak': 'off',
      'object-curly-newline': 'off',
      'function-paren-newline': 'off',
      'react/require-default-props': 'off',
      'react/jsx-wrap-multilines': 'off',
      'class-methods-use-this': 'off',
      'react/no-array-index-key': 'off',
      '@typescript-eslint/indent': 'off',
      'operator-linebreak': 'off',
      'import/order': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
