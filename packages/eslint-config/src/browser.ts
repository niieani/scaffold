/* eslint-disable import/no-commonjs,import/no-import-module-exports */
import type eslint from 'eslint'
import {TESTS_LIST} from '@niieani/scaffold-config-constants'

const config: eslint.Linter.Config = {
  plugins: [],
  env: {
    browser: true,
  },
  overrides: [
    {
      files: TESTS_LIST,
      env: {
        browser: false,
      },
    },
  ],
}

module.exports = config
