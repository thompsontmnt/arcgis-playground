// eslint.config.js
import { tanstackConfig } from '@tanstack/eslint-config'
import prettierConfig from 'eslint-config-prettier'
/** @type {import('eslint').Linter.FlatConfig[]} */
const customConfig = [
  ...tanstackConfig,
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  prettierConfig,
]

export default customConfig
