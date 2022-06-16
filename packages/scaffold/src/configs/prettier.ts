import type {PrettierConfig} from '@beemo/driver-prettier'
import {FOLDER_IGNORE_LIST} from '@niieani/scaffold-config-constants'

const config: PrettierConfig = {
  ignore: FOLDER_IGNORE_LIST,
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
}

export default config
