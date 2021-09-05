import {Blueprint, Driver, Predicates} from '@beemo/core'
import type {ViteDriverOptions, ViteMakeConfig} from './types'

export class ViteDriver
  extends Driver<ViteMakeConfig, ViteDriverOptions>
  implements Driver<ViteMakeConfig, ViteDriverOptions>
{
  override readonly name = 'vite'

  override blueprint(preds: Predicates): Blueprint<ViteDriverOptions> {
    const {string} = preds

    return {
      ...super.blueprint(preds),
      module: string(),
    }
  }

  override bootstrap() {
    this.setMetadata({
      bin: 'vite',
      configName: 'vite.config.js',
      dependencies: [],
      // configStrategy: STRATEGY_REFERENCE,
      description: this.tool.msg('app:viteDescription'),
      title: 'vite',
      watchOptions: [],
    })
  }
}
