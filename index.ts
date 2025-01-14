import { savToJSON } from "./src/parser/main"
import { trimJSON } from "./src/cleanup/trimmer"

// input file path or buffer
export default async function parseFile(file: Buffer | Uint8Array | string, { trim }: { trim?: boolean } = {}) {
    if (typeof file === "string") {
        try {
            const fs = await import("fs")
            file = fs.readFileSync(file) as Buffer
        } catch (err) {
            throw new Error("fs only working in a node environment, pass a Buffer: " + err)
        }
    }

    console.log("[sav2json] Converting file...")
    const json = await savToJSON(file)
    console.log("[sav2json] Completed!")

    return trim === false ? json : trimJSON(json)
}
