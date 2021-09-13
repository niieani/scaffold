# @niieani/scaffold

Installation steps:

```
yarn set version berry
yarn init # add --workspace if monorepo
echo 'nodeLinker: "node-modules"' >> .yarnrc.yml
yarn add @niieani/scaffold --dev
```

Setup your `.config/beemo.ts`, for example:

```ts
import type {ScaffoldConfig} from '@niieani/scaffold'

const config: ScaffoldConfig = {
  module: '@niieani/scaffold',
  drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript', 'webpack'],
  settings: {
    node: true,
    name: 'MyProject',
    engineTarget: 'web',
    codeTarget: 'es6',
    umd: {
      filename: 'myproject.js',
      export: 'default',
    },
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

Use "preSCRIPTNAME" and "postSCRIPTNAME" to customize built-in scripts.

Profit!
