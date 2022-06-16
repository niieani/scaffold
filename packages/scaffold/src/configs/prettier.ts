import type {PrettierConfig} from '@beemo/driver-prettier'
import {IGNORE_LIST} from '@niieani/scaffold-config-constants'

const config: PrettierConfig = {
  ignore: IGNORE_LIST,
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
}

export default config
