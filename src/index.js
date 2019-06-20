import path from "path"

import yargs from "yargs"
import fsp from "@absolunet/fsp"
import {noop} from "lodash"

const getPackageName = async cwd => {
  const packageJsonFile = path.join(cwd, "package.json")
  const packageJsonExists = await fsp.pathExists(packageJsonFile)
  if (packageJsonExists) {
    const pkg = await fsp.readJson(packageJsonFile)
    if (pkg?.name) {
      return pkg.name
    }
  }
  return path.basename(cwd)
}

const job = async args => {
  const cwd = process.cwd()
  const name = await getPackageName(cwd)
  process.stdout.write(`${name}\n`)
}

yargs.command("$0", "Returns the package name", noop, job).argv