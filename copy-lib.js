import fs from "fs"

const LIB = "./src/lib"
const DEST = "./dist/src/lib"
fs.cpSync(LIB, DEST, { recursive: true })
