import type {PrettierConfig} from '@beemo/driver-prettier'
import {ignore} from './shared/ignore'

const config: PrettierConfig = {
  ignore,
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
}

export default config
