import jestPreset from 'jest-preset-beemo'
import {omit} from 'lodash'
import beemoJestConfig from '@beemo/config-jest'
import type {JestConfig} from '@beemo/driver-jest'

const typedJestPreset = jestPreset as unknown as JestConfig

const config: JestConfig = {
  ...omit(typedJestPreset, ['testMatch']),
  ...omit(beemoJestConfig, ['preset']),
  testMatch: [
    '<rootDir>/packages/*/src/**/*.test.{ts,tsx,mts,cts,js,jsx,mjs,cjs}',
    '<rootDir>/src/**/*.test.{ts,tsx,mts,cts}',
  ],
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
  setupFilesAfterEnv: [
    /* '<rootDir>/tests/setup.ts' */
  ],
  clearMocks: true,
  transform: {
    '^.+\\.(c|m)?(t|j)sx?$': '@swc/jest',
  },
}

export default config
