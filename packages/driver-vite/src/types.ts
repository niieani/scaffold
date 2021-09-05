import type {UserConfigExport} from 'vite'
import type {DriverOptions} from '@beemo/core'

export type ViteMakeConfig = (
  options: ViteOptions,
  overrides?: UserConfigExport,
) => UserConfigExport

export interface ViteOptions {
  module?: string
}

export interface ViteDriverOptions extends DriverOptions, ViteOptions {}
