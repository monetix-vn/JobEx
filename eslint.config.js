import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Determinism and purity guards (plan sections 1 and 7): simulation packages may not touch
// wall-clock time, ambient randomness, or browser/network globals. Those come in through ports.
const bannedProperties = [
  {
    object: 'Math',
    property: 'random',
    message: 'Use the seeded RandomStream from the module host.',
  },
  { object: 'Date', property: 'now', message: 'Use the ClockPort; wall-clock time breaks replay.' },
  { object: 'performance', property: 'now', message: 'Wall-clock time breaks replay.' },
];
const bannedGlobals = [
  'window',
  'document',
  'fetch',
  'localStorage',
  'indexedDB',
  'XMLHttpRequest',
].map((name) => ({ name, message: 'Modules never touch the browser or network; use a port.' }));

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'out/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['packages/**/*.ts'],
    ignores: ['packages/client-web/**'],
    rules: {
      'no-restricted-properties': ['error', ...bannedProperties],
      'no-restricted-globals': ['error', ...bannedGlobals],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date']",
          message: 'Use the ClockPort; wall-clock time breaks replay.',
        },
      ],
    },
  },
);
