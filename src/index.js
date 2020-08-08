import fsp from "@absolunet/fsp"
import {isObjectLike} from "lodash"
import path from "path"
import yargs from "yargs"

const getPackageField = async (cwd, field) => {
  const packageJsonFile = path.join(cwd, "package.json")
  const packageJsonExists = await fsp.pathExists(packageJsonFile)
  if (packageJsonExists) {
    const pkg = await fsp.readJson(packageJsonFile)
    if (pkg?.[field]) {
      const value = pkg[field]
      if (Array.isArray(value)) {
        return value.join("\n")
      }
      if (value |> isObjectLike) {
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
yargs.command("$0 <field>", "Returns the value of a package field", builder, job).argv