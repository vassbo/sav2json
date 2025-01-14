import fs from "fs"
import parseFile from "../index"
import path from "path"

const SAVES_FOLDER = "%LOCALAPPDATA%\\FactoryGame\\Saved\\SaveGames"

;(async function test() {
    const files = fs.readdirSync(relativeToAbsolutePath(SAVES_FOLDER))
    const userID = files.find((a) => a.length === 17)
    if (!userID) throw new Error("Could not get USER ID, try changing the folder path.")

    const SAV_FILES_FOLDER = relativeToAbsolutePath(path.join(SAVES_FOLDER, userID))
    const savFiles = fs.readdirSync(SAV_FILES_FOLDER).filter((a) => a.includes(".sav"))

    let i = 0
    for (let fileName of savFiles) {
        i++
        // if (i < 5) return // DEBUG
        console.log(`Parsing file ${i}/${savFiles.length}: ${fileName}`)

        try {
            const json = await parseFile(path.join(SAV_FILES_FOLDER, fileName))
            if (i === 1) fs.writeFileSync(`../${path.basename(fileName, ".sav")}.json`, JSON.stringify(json, null, 2))
        } catch (err) {
            console.error(err)
        }
    }
})()

function relativeToAbsolutePath(path: string) {
    return path.replace(/%([^%]+)%/g, (_, key) => process.env[key] as any)
}
