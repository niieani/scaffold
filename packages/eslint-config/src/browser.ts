/* eslint-disable import/no-commonjs,import/no-import-module-exports */
import type eslint from 'eslint'
import {TESTS_LIST} from '@niieani/scaffold-config-constants'

const config: eslint.Linter.Config = {
  plugins: ['compat'],
  env: {
    browser: true,
  },
  rules: {
    // Warn about invalid API usage but do not fail the build
    'compat/compat': 'warn',
  },
  overrides: [
    {
      files: TESTS_LIST,
      env: {
        browser: false,
      },
      rules: {
        // Disable within tests as its noisy
        'compact/compat': 'off',
      },
    },
  ],
}

module.exports = config
