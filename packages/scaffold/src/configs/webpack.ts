// call like: yarn webpack build --mode production --entry ./lib/hashids.ts --env moduleTarget=umd|esm --env engineTarget=web --env name=MyLibrary --env outDir=dist/umd

// this is a config for compiling libraries
// for compiling websites, use vite

import path from 'path'

export = ({
  moduleTarget,
  // TODO: sync from beemo's config settings
  codeTarget = 'es2020',
  engineTarget,
  name = 'Library',
  export: exportName = 'default',
  filename = 'main.js',
  outDir = moduleTarget,
}: {
  moduleTarget: string
  codeTarget?: string
  engineTarget?: string
  name?: string
  export?: string
  filename?: string
  outDir?: string
}): import('webpack').Configuration => {
  const esmConfig: import('webpack').Configuration = {
    target: [codeTarget, engineTarget].filter(Boolean) as string[],
    output: {
      module: true,
      library: {
        type: 'module',
      },
      chunkFormat: 'module',
    },
    experiments: {
      outputModule: true,
      topLevelAwait: true,
    },
  }
  const umdConfig: import('webpack').Configuration = {
    target: [codeTarget, engineTarget ?? 'web'].filter(Boolean),
    output: {
      library: {
        type: 'umd2',
        export: exportName,
        name,
        umdNamedDefine: true,
      },
      chunkFormat: 'array-push',
    },
    experiments: {
      topLevelAwait: true,
    },
  }
  const selectedConfig = moduleTarget === 'esm' ? esmConfig : umdConfig
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
    },
    mode: 'production',
    optimization: {
      concatenateModules: true,
    },
    ...selectedConfig,
    output: {
      ...selectedConfig.output,
      filename,
      path: path.join(process.cwd(), outDir),
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  module: 'esnext',
                  target: codeTarget,
                  esModuleInterop: false,
                  sourceMap: true,
                },
              },
            },
          ],
        },
      ],
    },
  }
}
