import type {ViteDriverOptions} from './types'
import {ViteDriver} from './ViteDriver'

export type {ViteDriver}
export * from './types'

export default function viteDriver(options?: ViteDriverOptions) {
  return new ViteDriver({
    configStrategy: 'template',
    template: require.resolve('./template.ts'),
    ...options,
  })
}
