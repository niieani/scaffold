import jestPreset from 'jest-preset-beemo'
import {omit} from 'lodash'
import {defaults as tsjPreset} from 'ts-jest/presets'
import beemoJestConfig from '@beemo/config-jest'
import type {JestConfig} from '@beemo/driver-jest'

const typedJestPreset = jestPreset as unknown as JestConfig

const config: JestConfig = {
  ...omit(typedJestPreset, ['testMatch']),
  ...omit(beemoJestConfig, ['preset']),
  testMatch: [
    '<rootDir>/packages/*/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.test.{ts,tsx}',
  ],
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
