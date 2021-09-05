import {ScaffoldConfig} from '@niieani/scaffold'

const config: ScaffoldConfig = {
  module: '@niieani/scaffold',
  drivers: ['eslint', 'jest', 'prettier', 'typescript'],
  settings: {
    noCompile: true,
  },
}

export default config
