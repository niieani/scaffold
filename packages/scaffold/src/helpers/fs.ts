import fsBase from 'fs'
import fs from 'fs/promises'
import path from 'path'
import sortPackageJson from 'sort-package-json'
import type {PackageStructureWithMeta} from '../scripts/InitProject'

export async function writePackageJson(
  modulePath: string,
  updatedPackageJson: PackageStructureWithMeta,
) {
  await fs.writeFile(
    path.join(modulePath, 'package.json'),
    JSON.stringify(sortPackageJson(updatedPackageJson), null, 2),
  )
}
export async function fileExists(projectJsonPath: string) {
  return fs
    .access(
      projectJsonPath,
      // eslint-disable-next-line no-bitwise
      fsBase.constants.F_OK | fsBase.constants.R_OK | fsBase.constants.W_OK,
    )
    .then(
      () => true,
      () => false,
    )
}
