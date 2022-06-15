import {$} from 'zx'
import {Arguments, ParserOptions, Script, ScriptContext} from '@beemo/core'

interface Options {
  dryRun: boolean
}

class ReleaseScript extends Script<Options> {
  readonly name = 'release'

  override parse(): ParserOptions<Options> {
    return {
      options: {
        dryRun: {
          description: 'Execute a dry run',
          type: 'boolean',
        },
      },
    }
  }

  async execute(context: ScriptContext, args: Arguments<Options>) {
    const {GITHUB_TOKEN, GITHUB_REPOSITORY} = process.env
    if (!GITHUB_REPOSITORY) {
      throw new Error('Release step must be run inside of a GitHub Action')
    }

    const origin = `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`

    await $`npm config set workspaces-update false`
    await $`git remote set-url origin ${origin}`
    await $`git config --global user.email "action@github.com"`
    await $`git config --global user.name "GitHub Action"`
    await $`yarn build`

    const dryRun = args.options.dryRun ? '--dry-run' : ''

    await (context.workspaces.length > 0
      ? $`yarn rrun multi-semantic-release ${dryRun}`
      : $`yarn rrun semantic-release --tag-format '\${version}' ${dryRun}`)
  }
}

export default () => new ReleaseScript()
