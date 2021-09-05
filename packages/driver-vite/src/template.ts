import type {
  ConfigObject,
  ConfigTemplateOptions,
  ConfigTemplateResult,
} from '@beemo/core'
import type {ViteDriver} from './ViteDriver'

export default function customTemplate(
  [providerConfig, consumerConfig]: ConfigObject[],
  options: ConfigTemplateOptions,
): ConfigTemplateResult {
  const {configModule, providerConfigPath, consumerConfigPath} = options
  if (!providerConfigPath) {
    throw new Error('Provider Config is required')
  }
  const providerConfigModule = `${configModule}${providerConfigPath
    .path()
    .split(configModule)
    .pop()}`

  const consumerPath =
    consumerConfigPath &&
    options.tool.project.root.relativeTo(consumerConfigPath).path()

  const {
    args,
    configStrategy,
    dependencies,
    env,
    expandGlobs,
    outputStrategy,
    template,
    // omit internals, keep only actual config:
    ...driverOptions
  } = (options.driver as ViteDriver).options

  return {
    config: [
      `import {makeConfig} from '${providerConfigModule}';`,
      consumerPath ? `import overrides from './${consumerPath}';` : undefined,
      `export default makeConfig(`,
      `  ${JSON.stringify(driverOptions, null, 2).split('\n').join('\n  ')},`,
      consumerPath ? '  overrides' : undefined,
      `);`,
    ]
      .filter(Boolean)
      .join('\n'),

    // path: options.context.cwd.append('vite.config.ts'),
  }
}
