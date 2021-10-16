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

import type {ScaffoldConfig} from '..'

interface Options {
  force: boolean
  monorepo: boolean
  createModule: boolean
}

export type PackageStructureWithMeta = Omit<PackageStructure, 'version'> & {
  source?: string
  unpkg?: string
  version?: string
  release?: object
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
        createModule: {
          description: 'Creates an example template module',
          type: 'boolean',
        },
      },
    }
  }

  async execute(context: ScriptContext, args: Arguments<Options>) {
    if (!context.script) return

    const config = context.script.tool.config as ScaffoldConfig

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

    const packageName = packageJson.name ?? path.basename(process.cwd())
    const nameSplit = packageName.split('/')
    const gitScope = nameSplit.length > 1 ? nameSplit[0].slice(1) : 'niieani'
    const scope = nameSplit.length > 1 ? nameSplit[0] : undefined
    const nameWithoutScope = nameSplit[1] ?? packageName

    const source = packageJson.source ?? 'src/main.ts'
    const prefixedSource = source.startsWith('./') ? source : `./${source}`

    const sourceExtension = path.extname(source)
    const sourceWithoutExtension = source.slice(0, -sourceExtension.length)

    const distEsm = `${sourceWithoutExtension.replace('src', 'esm')}.js`
    const distCjs = `${sourceWithoutExtension.replace('src', 'cjs')}.js`
    const distUmd = `${sourceWithoutExtension.replace('src', 'dist')}.js`

    const {
      vite,
      codeTarget = 'es2020',
      engineTarget = 'web',
      name = capitalize(camelCase(nameWithoutScope)),
      umd: {
        export: exportName = 'default',
        filename: umdFilename = path.basename(distUmd),
      } = {},
      noCompile,
    } = config.settings ?? {}

    // TODO: do something better than this:
    const webpackBuild = Boolean(config.settings?.umd)

    const moduleDefinitions: Partial<PackageStructureWithMeta> = {
      main: noCompile ? source : distCjs,
      module: noCompile ? undefined : distEsm,
      source,
      unpkg: webpackBuild && !noCompile ? distUmd : undefined,
      exports: noCompile
        ? undefined
        : {
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
      publishConfig: {
        access: 'public',
      },
    }

    const workspaces = monorepo
      ? Array.isArray(packageJson.workspaces)
        ? {packages: packageJson.workspaces}
        : packageJson.workspaces ?? {
            packages: ['packages/*'],
          }
      : undefined

    const acrossWorkspacesArg = monorepo ? ` '--workspaces=*'` : ''
    const webpackArgs = {
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
        // TODO: use values from git config
        'Bazyli Brzoska <npm@invent.life> (https://invent.life)',
      repository: packageJson.repository ?? {
        type: 'git',
        url: `https://github.com/${gitScope}/${nameWithoutScope}.git`,
      },
      bugs: packageJson.bugs ?? {
        url: `https://github.com/${gitScope}/${nameWithoutScope}/issues`,
      },
    }
    const prettierRange = './{src,tests}/**/!(*.d).{.js,jsx,ts,tsx,json,md}'
    const runCommand = monorepo ? 'foreach-run' : 'rrun'

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
      license: 'MIT',
      ...(args.options.force ? {} : packageJson),
      scripts: {
        ...packageJson.scripts,
        // needs https://github.com/sachinraja/yarn-plugin-postinstall-dev
        postinstallDev: 'yarn prepare',
        prepare: `rrun husky install ${huskyHooksDir} && beemo create-config${
          monorepo ? ' && beemo typescript:sync-project-refs' : ''
        }`,
        format: `yarn ${runCommand} prettier --write "${prettierRange}"`,
        ...(monorepo
          ? {
              [runCommand]: `PATH="$PWD/node_modules/.bin:$PATH" yarn workspaces foreach --parallel --interlaced --topological --topological-dev --verbose run rrun`,
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
              build: noCompile
                ? `yarn ${runCommand} tsc --emitDeclarationOnly`
                : `yarn build:cjs && yarn build:esm${
                    webpackBuild ? ' && yarn build:umd' : ''
                  }`,
              release: 'beemo run-script release',
            }),
        ...(!noCompile
          ? {
              'build:cjs': `yarn ${runCommand} tsc --outDir cjs --module commonjs --target ${codeTarget}`,
              'build:esm': `yarn ${runCommand} tsc --outDir esm --module esnext --target ${codeTarget}`,
            }
          : {}),
        ...(webpackBuild && !noCompile
          ? {
              'build:umd': `beemo webpack --entry='${prefixedSource}' ${Object.entries(
                webpackArgs,
              )
                .map(([key, value]) => `--env '${key}=${value}'`)
                .join(' ')}${acrossWorkspacesArg}`,
            }
          : {}),
        // supports --interactive or --dry-run flags
        clean: `git clean -dfX --exclude=node_modules ${
          monorepo ? 'packages' : 'src'
        } && beemo typescript:sync-project-refs`,
        'test:lint': monorepo
          ? `rrun eslint 'packages/*/src/**'`
          : `rrun eslint 'src/**'`,
        'test:code': 'beemo jest',
        'test:types': `yarn ${runCommand} tsc --noEmit`,
        'test:format': `yarn ${runCommand} prettier --check "${prettierRange}"`,
        test: 'yarn test:format && yarn test:types && yarn test:lint && yarn test:code',
        // do not overwrite existing scripts unless --force was set:
        ...(args.options.force ? {} : packageJson.scripts),
      },
      dependencies: packageJson.dependencies ?? {},
      devDependencies: packageJson.devDependencies ?? {},
      workspaces,
      release: packageJson.release ?? {
        // eslint-disable-next-line no-template-curly-in-string
        tagFormat: monorepo ? undefined : '${version}',
        branches: [
          '+([0-9])?(.{+([0-9]),x}).x',
          'master',
          {
            name: 'main',
            channel: false,
          },
          'next',
          {
            name: 'beta',
            prerelease: true,
          },
          {
            name: 'alpha',
            prerelease: true,
          },
        ],
      },
    }

    await writePackageJson(rootPath, updatedPackageJson)

    const configPath = context.script.tool.project.root.relativeTo(
      path.join(__dirname, '..', 'configs', 'shared', 'commitlint.config.js'),
    )
    const commitHook = `yarn rrun commitlint --config "${configPath}" --edit "$1"`

    if (args.options.createModule) {
      if (workspaces) {
        const packagesDir = path.dirname(
          workspaces.packages?.[0] ?? 'packages/*',
        )
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
    }

    await $`yarn`
    await $`yarn rrun husky set ${huskyHooksDir}/commit-msg ${commitHook}`
    await $`yarn beemo scaffold common basics`
  }
}

export default () => new InitProjectScript()
