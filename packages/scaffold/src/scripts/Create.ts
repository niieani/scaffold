import {Arguments, ParserOptions, Script, ScriptContext} from '@beemo/core'

interface Options {
  dryRun: boolean
}

class CreateScript extends Script<Options> {
  readonly name = 'create'

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
    // const dryRun = args.options.dryRun ? '--dry-run' : ''
    // const packageJson = context.script.tool.project.getPackage()
  }
}

export default () => new CreateScript()
