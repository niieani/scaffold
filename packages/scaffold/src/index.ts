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
  codeTarget?: `es${number}`
  engineTarget?: 'node' | 'web'
  name?: string
  umd?: {
    export: string
    filename: string
  }
}

export default async function bootstrap(tool: Tool) {
  // workaround for https://github.com/beemojs/beemo/issues/146
  tool.scriptRegistry.onAfterRegister.listen((script) => {
    // eslint-disable-next-line no-param-reassign
    script.tool = tool
  })

  const {vite} = tool.config.settings
  if (vite) {
    await tool.driverRegistry.load(
      require.resolve('../drivers/Vite.ts'),
      undefined,
      {tool},
    )
  }
  if (tool.driverRegistry.isRegistered('typescript')) {
    const tsDriver: TypeScriptDriver = tool.driverRegistry.get('typescript')
    tsDriver.onCreateProjectConfigFile.listen((_configPath, packageConfig) => {
      // remove buildFolder references:
      // eslint-disable-next-line no-param-reassign
      // delete packageConfig.compilerOptions!.declarationDir
      if (!packageConfig.compilerOptions) return
      // eslint-disable-next-line no-param-reassign
      // delete packageConfig.compilerOptions.outDir
      // eslint-disable-next-line no-param-reassign
      // packageConfig.compilerOptions.emitDeclarationOnly = true
      // packageConfig.exclude?.push('node_modules')
      // packageConfig.exclude?.shift()
    })
  }
}
