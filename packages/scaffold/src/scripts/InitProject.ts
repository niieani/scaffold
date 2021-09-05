import path from 'path'
import camelCase from 'lodash/camelCase'
import capitalize from 'lodash/capitalize'
import {$, nothrow} from 'zx'
import {
  Arguments,
  PackageStructure,
  ParserOptions,
  Script,
  ScriptContext,
} from '@beemo/core'
import {fileExists, writePackageJson} from '../helpers/fs'

import type {BeemoSettings} from '..'

interface Options {
  force: boolean
  monorepo: boolean
}

export type PackageStructureWithMeta = Omit<PackageStructure, 'version'> & {
  source?: string
  unpkg?: string
  version?: string
}

class InitProjectScript extends Script<Options> {
  readonly name = 'init-project'

  override parse(): ParserOptions<Options> {
    return {
      options: {
        force: {
          description: 'Forceful overwrite of existing scaffold',
          type: 'boolean',
        },
        monorepo: {
          description: 'Initialize as monorepo',
          type: 'boolean',
        },
      },
    }
  }

  async execute(context: ScriptContext, args: Arguments<Options>) {
    if (!context.script) return

    await $`yarn plugin import interactive-tools`
    await $`yarn plugin import typescript`
    await $`yarn plugin import https://raw.githubusercontent.com/sachinraja/yarn-plugin-postinstall-dev/main/bundles/%40yarnpkg/plugin-postinstall-dev.js`

    const packageJson: PackageStructureWithMeta =
      context.script.tool.project.getPackage()
    const monorepo = Boolean(packageJson.workspaces) || args.options.monorepo

    if (monorepo) {
      await $`yarn plugin import workspace-tools`
    }

    const rootPath = context.script.tool.project.root.path()
    const huskyHooksDir = '.config/husky'

    const webpackBuild =
      context.script.tool.driverRegistry.isRegistered('webpack')

    const packageName = packageJson.name ?? path.basename(process.cwd())
    const nameSplit = packageName.split('/')
    const gitScope = nameSplit.length > 1 ? nameSplit[0] : 'niieani'
    const scope = nameSplit.length > 1 ? nameSplit[0] : undefined
    const nameWithoutScope = nameSplit[1] ?? packageName

    const source = packageJson.source ?? 'src/main.ts'
    const prefixedSource = source.startsWith('./') ? source : `./${source}`

    const sourceExtension = path.extname(source)
    const sourceWithoutExtension = source.slice(0, -sourceExtension.length)

    const distEsm = `${sourceWithoutExtension.replace('src', 'esm')}.js`
    const distCjs = `${sourceWithoutExtension.replace('src', 'cjs')}.js`
    const distUmd = `${sourceWithoutExtension.replace('src', 'dist')}.js`

    const moduleDefinitions: Partial<PackageStructureWithMeta> = {
      main: distCjs,
      module: distEsm,
      source,
      unpkg: webpackBuild ? distUmd : undefined,
      exports: {
        '.': {
          import: `./${distEsm}`,
          require: `./${distCjs}`,
        },
        './*': {
          import: `./${path.dirname(distEsm)}/*.js`,
          require: `./${path.dirname(distCjs)}/*.js`,
        },
        './cjs': {
          require: `./${distCjs}`,
        },
        './cjs/*': {
          require: `./${path.dirname(distCjs)}/*.js`,
        },
        './esm/*': {
          import: `./${path.dirname(distEsm)}/*.js`,
        },
        './package.json': './package.json',
      },
    }

    const {
      vite,
      codeTarget = 'es2020',
      engineTarget = 'web',
      name = capitalize(camelCase(nameWithoutScope)),
      umd: {
        export: exportName = 'default',
        filename: umdFilename = path.basename(distUmd),
      } = {},
    } = context.script.tool.config.settings as BeemoSettings

    const workspaces = monorepo
      ? Array.isArray(packageJson.workspaces)
        ? {packages: packageJson.workspaces}
        : packageJson.workspaces ?? {
            packages: ['packages/*'],
          }
      : undefined

    const acrossWorkspacesArg = monorepo ? ` '--workspaces=*'` : ''
    const webpackArgs = {
      entry: prefixedSource,
      outDir: 'dist',
      moduleTarget: 'umd',
      engineTarget,
      codeTarget,
      name,
      export: exportName,
      filename: umdFilename,
    }

    const commonPackageInfo = {
      author:
        packageJson.author ??
        'Bazyli Brzoska <npm@invent.life> (https://invent.life)',
      repository: packageJson.repository ?? {
        type: 'git',
        url: `https://github.com/${gitScope}/${nameWithoutScope}.git`,
      },
      bugs: packageJson.bugs ?? {
        url: `https://github.com/${gitScope}/${nameWithoutScope}/issues`,
      },
    }

    const prettierRange = './{src,tests}/**/*.{js,jsx,ts,tsx,json,md}'

    const updatedPackageJson: PackageStructureWithMeta = {
      ...packageJson,
      ...commonPackageInfo,
      ...(monorepo
        ? {
            main: undefined,
            module: undefined,
            source: undefined,
            exports: undefined,
            private: true,
          }
        : moduleDefinitions),
      ...(args.options.force ? {} : packageJson),
      scripts: {
        ...packageJson.scripts,
        // needs https://github.com/sachinraja/yarn-plugin-postinstall-dev
        postinstallDev: 'yarn prepare',
        prepare: `beemo create-config > /dev/null && rrun husky install ${huskyHooksDir}${
          monorepo ? ' && beemo typescript:sync-project-refs' : ''
        }`,
        format: `beemo prettier --write "./{src,tests}/**/*.{js,json,md}"${acrossWorkspacesArg}`,
        ...(monorepo
          ? {
              'foreach-run': `PATH="$PWD/node_modules/.bin:$PATH" yarn workspaces foreach --verbose run rrun`,
            }
          : {}),
        ...(vite
          ? {
              start: 'rrun vite',
              serve: 'rrun vite preview',
              build: 'yarn build:esm && rrun vite build',
              release: 'echo releasing sites not implemented yet',
            }
          : {
              build: `yarn build:cjs && yarn build:esm${
                webpackBuild ? ' && yarn build:umd' : ''
              }`,
              release: 'beemo run-script release',
            }),
        'build:cjs': `yarn foreach-run tsc --outDir cjs --module commonjs --target ${codeTarget}`,
        'build:esm': `yarn foreach-run tsc --outDir esm --module esnext --target ${codeTarget}`,
        ...(webpackBuild
          ? {
              'build:umd': `beemo webpack ${Object.entries(webpackArgs)
                .map(([key, value]) => `--env '${key}=${value}'`)
                .join(' ')}${acrossWorkspacesArg}`,
            }
          : {}),
        'test:lint': 'beemo eslint',
        'test:code': 'beemo jest',
        'test:types': 'yarn foreach-run tsc --noEmit',
        'test:format': `yarn foreach-run prettier --check "${prettierRange}"`,
        test: 'yarn test:format && yarn test:types && yarn test:lint && yarn test:code',
        // do not overwrite existing scripts unless --force was set:
        ...(args.options.force ? {} : packageJson.scripts),
      },
      dependencies: packageJson.dependencies ?? {},
      devDependencies: packageJson.devDependencies ?? {},
      workspaces,
    }

    await writePackageJson(rootPath, updatedPackageJson)

    const configPath = context.script.tool.project.root.relativeTo(
      path.join(__dirname, '..', 'configs', 'shared', 'commitlint.config.js'),
    )
    const commitHook = `yarn rrun commitlint --config "${configPath}" --edit "$1"`

    if (workspaces) {
      const packagesDir = path.dirname(workspaces.packages?.[0] ?? 'packages/*')
      await $`mkdir -p "${packagesDir}/common/src"`
      const packagePath = path.join(rootPath, packagesDir, 'common')
      const projectJsonPath = path.join(
        rootPath,
        `${packagesDir}/common/package.json`,
      )
      const commonExists = await fileExists(projectJsonPath)

      if (!commonExists) {
        await writePackageJson(packagePath, {
          name: scope ? `${scope}/common` : `${nameWithoutScope}-common`,
          ...commonPackageInfo,
          ...moduleDefinitions,
          scripts: {
            rrun: 'rrun',
          },
          sideEffects: false,
          dependencies: {},
        })
        const nestedSource = `packages/common/${source}`
        await nothrow(
          $`[[ ! -f ${nestedSource} ]] && echo '// hello world' > ${nestedSource}`,
        )
      }
    } else {
      await $`mkdir -p src`
      await nothrow(
        $`[[ ! -f ${source} ]] && echo '// hello world' > ${source}`,
      )
    }

    await $`yarn`
    await $`yarn rrun husky add ${huskyHooksDir}/commit-msg ${commitHook}`
    await $`yarn beemo scaffold common basics`
  }
}

export default () => new InitProjectScript()
