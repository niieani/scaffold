import {IGNORE_LIST} from '@beemo/config-constants'
import {IGNORE_LIST as IGNORE_LIST_PATCHED} from '@beemo/config-constants-patched'
import type {BeemoConfig, ConfigObject, Path, Tool} from '@beemo/core'
import {CreateConfigRoutine} from '@beemo/core/lib/routines/CreateConfigRoutine'
import type {TypeScriptDriver} from '@beemo/driver-typescript'
import {requireModule} from '@boost/module'

// monkey patch to allow functions to be used as configs
CreateConfigRoutine.prototype.loadConfigAtPath = function loadConfigAtPath(
  filePath: Path,
): ConfigObject {
  const config = requireModule<ConfigObject>(filePath).default
  return config
}

export interface ScaffoldConfig extends BeemoConfig<BeemoSettings> {}

export interface BeemoSettings {
  vite?: boolean
  noCompile?: boolean
  codeTarget?: `es${number}`
  engineTarget?: 'node' | 'web'
  name?: string
  umd?: {
    export: string
    filename: string
  }
  // used by @beemo/config-eslint
  node?: boolean
}

export default async function bootstrap(tool: Tool) {
  // hack, will be fixed when not using `beemo`
  IGNORE_LIST.length = 0
  IGNORE_LIST.push(...IGNORE_LIST_PATCHED)

  // workaround for https://github.com/beemojs/beemo/issues/146
  tool.scriptRegistry.onAfterRegister.listen((script) => {
    // eslint-disable-next-line no-param-reassign
    script.tool = tool
  })

  const {vite, noCompile} = tool.config.settings as BeemoSettings
  if (vite) {
    await tool.driverRegistry.load(
      require.resolve('../drivers/Vite.ts'),
      undefined,
      {tool},
    )
  }
  if (tool.driverRegistry.isRegistered('typescript') && noCompile) {
    const tsDriver: TypeScriptDriver = tool.driverRegistry.get('typescript')
    tsDriver.onCreateProjectConfigFile.listen((_configPath, packageConfig) => {
      if (!packageConfig.compilerOptions) return
      // remove buildFolder references:
      // eslint-disable-next-line no-param-reassign
      delete packageConfig.compilerOptions.declarationDir
      // eslint-disable-next-line no-param-reassign
      delete packageConfig.compilerOptions.outDir
      // eslint-disable-next-line no-param-reassign
      packageConfig.compilerOptions.sourceMap = false
      // packageConfig.exclude?.push('node_modules')
      // packageConfig.exclude?.shift()
    })
  }
}
