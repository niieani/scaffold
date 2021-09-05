import type {UserConfig} from 'vite'
import type {ViteMakeConfig} from '@niieani/beemo-driver-vite'
import resolve from '@rollup/plugin-node-resolve'
import reactRefresh from '@vitejs/plugin-react-refresh'
// import polyfillNode from 'rollup-plugin-polyfill-node'
// import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export const makeConfig: ViteMakeConfig =
  (options, overridesDefinition) =>
  async (env): Promise<UserConfig> => {
    const overrides =
      (await (typeof overridesDefinition === 'function'
        ? overridesDefinition(env)
        : overridesDefinition)) ?? {}

    return {
      ...overrides,
      plugins: [
        resolve({
          browser: true,
          preferBuiltins: false,
        }),
        reactRefresh(),
        ...(overrides.plugins ?? []),
        // polyfillNode(),
        // NodeModulesPolyfillPlugin(),
        // GlobalsPolyfills({
        //   buffer: true,
        // }),
      ],
      optimizeDeps: {
        ...overrides.optimizeDeps,
        // The libraries that need shimming should be excluded from dependency optimization.
        exclude: [
          ...(overrides?.optimizeDeps?.exclude ?? []),
          'safe-buffer',
          'sha.js',
          'buffer',
        ],
      },
    }
  }

export default {}
