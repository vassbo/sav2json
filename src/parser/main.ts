import type { GenericObject } from "../data/DataTypes"
import { $compressedSaveFileBody, $saveFileBody, $saveFileHeader } from "../data/SaveFile"
import { decode } from "../decoders/decoders"
import { $objectReference } from "../data/Object"
import { decodeGenericList, unmatchingSize } from "./common"
import { decodeLevelGroupingGrids, decodeLevels } from "./level"
import { concatBuffers, zlibDecompress } from "../decoders/zlib"

// https://satisfactory.wiki.gg/wiki/Save_files#Save_file_format
// https://satisfactory.fandom.com/wiki/Save_files#Save_File_Format

export async function savToJSON(BUFFER: Buffer | Uint8Array) {
    let DATA: GenericObject = {}
    let OFFSET: number = 0

    // HEADER
    Object.entries($saveFileHeader).forEach(([key, data]) => {
        const decoded = decode(data.type, BUFFER, OFFSET)
        OFFSET += decoded.bytes
        DATA[key] = decoded.value
    })

    // COMPRESSED BODY
    let compressedSaveFileBody: GenericObject[] = []
    let loopStop = 0
    while (OFFSET < BUFFER.length && loopStop < 50000) {
        loopStop++

        let bodyChunk: GenericObject = {}
        Object.entries($compressedSaveFileBody).forEach(([key, data]) => {
            // skip if header is v1
            if (key === "compressionAlgorithm" && bodyChunk.archiveHeader === "00000000") return

            const decoded = decode(data.type, BUFFER, OFFSET)
            OFFSET += decoded.bytes
            bodyChunk[key] = decoded.value

            /// VALIDATE ///
            if (key === "unrealEnginePackageSignature" && decoded.value !== "c1832a9e") {
                throw new Error(`Incorrect package signature: ${decoded.value} !== 9E2A83C1`)
            } else if (key === "archiveHeader" && decoded.value !== "00000000" && decoded.value !== "22222222") {
                throw new Error(`Incorrect archive header: ${decoded.value} !== (0x00000000: v1 | 0x22222222: v2)`)
            } else if (key === "maximumChunkSize" && decoded.value !== 131072) {
                throw new Error(`Incorrect max chunk size: ${decoded.value} !== (128 * 1024)`)
            } else if (key === "compressionAlgorithm" && decoded.value !== 3) {
                throw new Error(`Unsupported compression algorithm: ${decoded.value} !== 3`)
            } else if (key === "compressedSizeRepeat" && bodyChunk.compressedSize !== decoded.value) {
                throw new Error(unmatchingSize("Compressed size", bodyChunk.compressedSize, decoded.value))
            } else if (key === "uncompressedSizeRepeat" && bodyChunk.uncompressedSize !== decoded.value) {
                throw new Error(unmatchingSize("Uncompressed size", bodyChunk.uncompressedSize, decoded.value))
            }
        })

        const NEW_OFFSET = OFFSET + bodyChunk.compressedSize
        bodyChunk.body = BUFFER.slice(OFFSET, OFFSET + NEW_OFFSET)

        OFFSET = NEW_OFFSET
        compressedSaveFileBody.push(bodyChunk)
    }

    // decompress
    let bodyBuffers = await Promise.all(compressedSaveFileBody.map(async (a) => await zlibDecompress(a)))
    const BUFFER_BODY = concatBuffers(bodyBuffers)
    // reset offset
    OFFSET = 0

    // BODY
    let saveFileBody: GenericObject = {}
    Object.entries($saveFileBody).forEach(([key, data]) => {
        let decoded
        if (key === "levelGroupingGrids") decoded = decodeLevelGroupingGrids(BUFFER_BODY, OFFSET)
        else if (key === "levels") decoded = decodeLevels(BUFFER_BODY, OFFSET, saveFileBody.sublevelCount + 1) // include PersistentLevel
        else if (key === "objectReferences") decoded = decodeGenericList($objectReference, BUFFER_BODY, OFFSET, saveFileBody.objectReferencesCount)
        else decoded = decode(data.type, BUFFER_BODY, OFFSET)

        OFFSET += decoded.bytes
        saveFileBody[key] = decoded.value

        /// VALIDATE ///
        if (key === "uncompressedSize" && decoded.value !== BUFFER_BODY.length - 8) {
            throw new Error(unmatchingSize("Uncompressed size", decoded.value, BUFFER_BODY.length - 8))
        }
    })
    DATA.saveFileBody = saveFileBody

    /// VALIDATE ///
    if (OFFSET < BUFFER_BODY.length) {
        throw new Error(unmatchingSize("Final buffer offset", OFFSET, BUFFER_BODY.length))
    }

    return DATA
}
