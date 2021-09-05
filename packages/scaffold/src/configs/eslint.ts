import {TESTS_LIST} from '@beemo/config-constants'
import beemoConfig from '@beemo/config-eslint'
import type {ESLintConfig} from '@beemo/driver-eslint'
import {ignore} from './shared/ignore'

const config: ESLintConfig = {
  ...beemoConfig,
  ignore,
  plugins: ['eslint-comments'],
  overrides: [
    {
      files: TESTS_LIST,
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
      },
    },
  ],
  rules: {
    complexity: 'off',
    'sort-keys': 'off',
    'no-tabs': 'error',
    'no-nested-ternary': 'off',

    // require a eslint-enable comment for every eslint-disable comment
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    // disallow a eslint-enable comment for multiple eslint-disable comments
    'eslint-comments/no-aggregating-enable': 'error',
    // disallow duplicate eslint-disable comments
    'eslint-comments/no-duplicate-disable': 'error',
    // disallow eslint-disable comments without rule names
    'eslint-comments/no-unlimited-disable': 'error',
    // disallow unused eslint-disable comments
    'eslint-comments/no-unused-disable': 'error',
    // disallow unused eslint-enable comments
    'eslint-comments/no-unused-enable': 'error',
    // disallow ESLint directive-comments
    'eslint-comments/no-use': [
      'error',
      {
        allow: [
          'eslint-disable',
          'eslint-disable-line',
          'eslint-disable-next-line',
          'eslint-enable',
        ],
      },
    ],
  },
}

export default config
