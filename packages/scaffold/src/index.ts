import type {BeemoConfig, ConfigObject, Path, Tool} from '@beemo/core'
import {CreateConfigRoutine} from '@beemo/core/lib/routines/CreateConfigRoutine'
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
  react?: boolean
}

export default async function bootstrap(tool: Tool) {
  const {vite} = tool.config.settings as BeemoSettings
  if (vite) {
    await tool.driverRegistry.load(
      require.resolve('../drivers/Vite.ts'),
      undefined,
      {tool},
    )
  }
  // if (tool.driverRegistry.isRegistered('typescript')) {
  //   const tsDriver: TypeScriptDriver = tool.driverRegistry.get('typescript')
  //   tsDriver.onCreateProjectConfigFile.listen((_configPath, packageConfig) => {
  //   })
  // }
}
