import path from "node:path"

import fs from "fs-extra"
import {isObjectLike} from "lodash-es"
import yargs from "yargs"

const getPackageField = async (cwd, field) => {
  const packageJsonFile = path.join(cwd, "package.json")
  const packageJsonExists = await fs.pathExists(packageJsonFile)
  if (packageJsonExists) {
    const pkg = await fs.readJson(packageJsonFile)
    if (pkg?.[field]) {
      const value = pkg[field]
      if (Array.isArray(value)) {
        return value.join("\n")
      }
      if (isObjectLike(value)) {
        return Object.keys(value).join("\n")
      }
      return value
    }
  }
  process.exit(1)
}

const job = async ({cwd, field}) => {
  const value = await getPackageField(cwd, field)
  process.stdout.write(String(value))
}

const builder = () => ({
  cwd: {
    default: process.cwd(),
    type: "string",
  },
})
yargs.command("$0 <field>", "Returns the value of a package field", builder, job).argv