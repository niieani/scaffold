import type {CompilerOptions} from 'typescript'
import type {TypeScriptConfig} from '@beemo/driver-typescript'
import {ignore} from './shared/ignore'

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
    importsNotUsedAsValues: 'error',
    moduleResolution: 'node',
    noImplicitOverride: true,
    noImplicitReturns: true,
    resolveJsonModule: true,
    skipLibCheck: true,
  },
  exclude: ignore,
}

export default config
