import path from "node:path"

import coffee from "coffee"

const main = path.resolve(process.env.MAIN)

it("should run internal command", () => coffee.fork(main, ["webpackConfigJaid"])
  .expect("code", 0)
  .expect("stdout", "cli")
  .debug(true)
  .end())

it("should run internal command", () => coffee.fork(main, ["scripts"])
  .expect("code", 0)
  .expect("stdout", /\ntest\n/s)
  .debug(true)
  .end())