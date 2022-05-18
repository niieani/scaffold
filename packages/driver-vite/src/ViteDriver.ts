import {Blueprint, Driver, Schemas} from '@beemo/core'
import type {ViteDriverOptions, ViteMakeConfig} from './types'

export class ViteDriver
  extends Driver<ViteMakeConfig, ViteDriverOptions>
  implements Driver<ViteMakeConfig, ViteDriverOptions>
{
  override readonly name = 'vite'

  override blueprint(schemas: Schemas): Blueprint<ViteDriverOptions> {
    const {string} = schemas

    return {
      ...super.blueprint(schemas),
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
