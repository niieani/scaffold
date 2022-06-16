import beemoConfig from '@beemo/config-eslint'
import type {ESLintConfig} from '@beemo/driver-eslint'
import {IGNORE_LIST, TESTS_LIST} from '@niieani/scaffold-config-constants'

const config: ESLintConfig = {
  ...beemoConfig,
  ignore: IGNORE_LIST,
  extends: [
    'plugin:import/typescript',
    ...(Array.isArray(beemoConfig.extends)
      ? beemoConfig.extends.map((value) => value.replace('beemo', 'niieani'))
      : []),
  ],
  plugins: ['eslint-comments'],
  overrides: [
    {
      // TODO: fix TESTS_LIST to include .test.ts files too
      files: TESTS_LIST,
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
        'import/no-extraneous-dependencies': ['error', {devDependencies: true}],
        // does not apply to test files, as they're not publishable anyway
        'node/no-unpublished-import': 'off',
      },
    },
  ],
  rules: {
    complexity: 'off',
    'sort-keys': 'off',
    'no-tabs': 'error',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',

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
