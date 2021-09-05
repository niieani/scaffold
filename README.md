# beemo-build-tools

Steps:

```
yarn set version berry
yarn init # add --workspace if monorepo
echo 'nodeLinker: "node-modules"' >> .yarnrc.yml
yarn add @niieani/scaffold --dev
```

Setup your `.config/beemo.ts`, for example:

```ts
import {BeemoConfig} from '@beemo/core'

const config: BeemoConfig = {
  module: '@niieani/scaffold',
  drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript', 'webpack'],
  settings: {
    // for vite:
    vite: true,
  },
}

export default config
```

Run scaffolding:

```
yarn beemo run-script init-project
```

Make it into a repo:

```
git init
```

Add `NPM_TOKEN` secret to GitHub repo for semantic-release to work.

Profit!
