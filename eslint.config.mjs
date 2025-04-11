// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  {
    ignores: [
      'dist/**/*',
      '*.config.*',
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let'], next: '*'},
        { blankLine: 'any',    prev: ['const', 'let'], next: ['const', 'let']}
      ],
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': 'error',
      '@stylistic/quotes': ['error', 'single'],
    }
  },
  {
    files: ['tests/**/*'],
    ...vitest.configs?.recommended,
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  }
);
