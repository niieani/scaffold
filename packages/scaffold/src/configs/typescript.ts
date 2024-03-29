import type {CompilerOptions} from 'typescript'
import type {TypeScriptConfig} from '@beemo/driver-typescript'
import {FOLDER_IGNORE_LIST} from '@niieani/scaffold-config-constants'

interface TSConfig extends TypeScriptConfig {
  compilerOptions: Pick<CompilerOptions, 'noImplicitOverride'> &
    TypeScriptConfig['compilerOptions']
}

const config: TSConfig = {
  compilerOptions: {
    strict: true,
    module: 'esnext',
    target: 'esnext',
    esModuleInterop: true,
    outDir: 'dist',
    rootDir: 'src',
    sourceMap: true,
    declaration: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'node',
    noImplicitOverride: true,
    noImplicitReturns: true,
    noUncheckedIndexedAccess: true,
    resolveJsonModule: true,
    skipLibCheck: true,
  },
  exclude: FOLDER_IGNORE_LIST,
}

export default config
