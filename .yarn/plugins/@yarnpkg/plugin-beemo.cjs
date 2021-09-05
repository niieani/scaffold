// @ts-check

module.exports = {
  name: '@yarnpkg/plugin-beemo',
  factory: (require) => {
    const {spawn} = require('child_process')

    /** @type {import('@yarnpkg/core').Plugin<import('@yarnpkg/core').Hooks>} */
    const plugin = {
      hooks: {
        wrapScriptExecution: async (
          executor,
          project,
          locator,
          scriptName,
          _extra,
        ) => {
          if (scriptName === 'beemo') return executor
          const workspace = project.getWorkspaceByLocator(locator)
          if (project.cwd !== workspace.cwd) return executor
          await new Promise((resolve) =>
            spawn('yarn', ['run', 'beemo', 'create-config'], {
              cwd: project.cwd,
              stdio: 'inherit',
            }).addListener('exit', resolve),
          )
          return executor
        },
      },
    }
    return plugin
  },
}
