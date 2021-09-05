import type {BabelConfig} from '@beemo/driver-babel'

const {tool} = process.beemo

const config: BabelConfig = {
  babelrc: true,
  babelrcRoots: tool.project.getWorkspaceGlobs({relative: true}),
  presets: ['@babel/preset-env'],
}

export default config
