import {defaults as tsjPreset} from 'ts-jest/presets'
import beemoJestConfig from '@beemo/config-jest'
import type {JestConfig} from '@beemo/driver-jest'

const config: JestConfig = {
  ...beemoJestConfig,
  setupFilesAfterEnv: [
    /* '<rootDir>/tests/setup.ts' */
  ],
  clearMocks: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleFileExtensions: tsjPreset.moduleFileExtensions,
  transform: {
    ...tsjPreset.transform,
  },
}

export default config
