import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  globalIgnores([
    '__checks__/**',
    'next.config.js',
    'deploy/**',
    'dist/**',
    '.next/**',
    '.sanity/**',
    'node_modules',
    'jest.config.js',
    'sanity.types.ts',
  ]),
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/no-duplicates': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-useless-escape': 'off',
      'no-unused-vars': 'off',
      'no-return-await': 'error',
    },
  },
]);

export default eslintConfig;
