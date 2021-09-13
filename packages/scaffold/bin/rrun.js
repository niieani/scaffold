#!/usr/bin/env node
// allows for running bins from transitive dependencies
process.argv.splice(1, 1)
const command = process.argv[1]
try {
  require(`${process.cwd()}/node_modules/.bin/${command}`)
} catch (e) {
  const which = require('which')
  const resolved = which.sync(command, {nothrow: true})
  if (!resolved) {
    console.error(`command not found: ${command}`)
    process.exit(1)
  }
  const fs = require('fs')
  const bin = fs.readFileSync(resolved).toString()
  // this is just yarn's BS temp redirect :( see https://github.com/yarnpkg/berry/blob/a4e208e228a416d70c57faaf2c1a7b9754985e56/packages/yarnpkg-core/sources/scriptUtils.ts#L42-L44
  if (bin.startsWith('#!/bin/sh')) {
    const [, right] = bin.split(`node" '`)
    const [actualBin] = right.split(`' "$@"`)
    require(actualBin)
  } else {
    require(resolved)
  }
}
