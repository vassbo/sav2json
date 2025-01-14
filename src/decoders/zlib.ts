import type { GenericObject } from "../data/DataTypes"
import { unmatchingSize } from "../parser/common"

export async function zlibDecompress(data: GenericObject) {
    // this does not match
    // if (data.compressedSize !== data.body.length) {
    //    throw new Error( unmatchingSize("Compressed size", data.compressedSize, data.body.length))
    // }

    const decompressedChunk = await zlib(data.body)

    if (data.uncompressedSize !== decompressedChunk.length) {
        throw new Error(unmatchingSize("Uncompressed size", data.uncompressedSize, decompressedChunk.length))
    }

    return decompressedChunk
}

function zlib(buffer: Buffer | Uint8Array): Promise<Buffer | Uint8Array> {
    return new Promise(async (resolve) => {
        try {
            const zlib = await import("zlib")
            zlib.unzip(buffer, (err, buffer) => {
                if (err) throw new Error(err.toString())
                resolve(buffer)
            })
        } catch (err) {
            // probably client
            try {
                // @ts-ignore
                // https://www.npmjs.com/package/fflate
                const fflate = await import("../lib/fflate.esm.min.mjs")
                resolve(fflate.unzlibSync(buffer))
                // fflate.unzlib(buffer, {}, (err: Error | null, buffer: Uint8Array) => {
                //     if (err) throw new Error(err.toString())
                //     resolve(buffer)
                // })
            } catch (err) {
                throw new Error("zlib only working in a node environment: " + err)
            }
        }
    })
}

export function concatBuffers(data: Buffer[] | Uint8Array[]) {
    try {
        return Buffer.concat(data)
    } catch (err) {
        return concatUint8Arrays(data)
    }
}

function concatUint8Arrays(arrays: Uint8Array[]) {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.byteLength, 0)
    const result = new Uint8Array(totalLength)

    let offset = 0
    arrays.forEach((arr) => {
        result.set(arr, offset)
        offset += arr.byteLength
    })

    return result
}
