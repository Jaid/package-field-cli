import path from "node:path"

import fs from "fs-extra"
import {isObjectLike} from "lodash-es"
import yargs from "yargs"
import {hideBin} from "yargs/helpers" // eslint-disable-line node/file-extension-in-import -- This is not a real file path, this is a resolve shortcut defined in node_modules/yargs/package.json[exports][./helpers]

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

const builder = {
  cwd: {
    default: process.cwd(),
    type: "string",
  },
}

await yargs(hideBin(process.argv))
  .scriptName(process.env.REPLACE_PKG_NAME)
  .version(process.env.REPLACE_PKG_VERSION)
  .command("$0 <field>", process.env.REPLACE_PKG_DESCRIPTION, builder, job)
  .parse()