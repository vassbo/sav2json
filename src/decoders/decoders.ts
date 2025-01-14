import type { DecoderType } from "../data/DataTypes"
import { debugLog } from "../parser/common"

export const decoders = {
    // string
    string: { bytes: 0, decode: (b: Uint8Array, o: number) => readString(b, o) },

    // number
    int: { bytes: 4, decode: (b: Uint8Array, o: number) => readInt(b, o) },
    int64: { bytes: 8, decode: (b: Uint8Array, o: number) => readLong(b, o) },
    float: { bytes: 4, decode: (b: Uint8Array, o: number) => readFloat(b, o) },
    float64: { bytes: 8, decode: (b: Uint8Array, o: number) => readDouble(b, o) },

    // other
    md5: { bytes: 20, decode: (b: Uint8Array, o: number) => readMD5(b, o) },
    byte: { bytes: 1, decode: (b: Uint8Array, o: number) => readByte(b, o) },
    hex: { bytes: 4, decode: (b: Uint8Array, o: number) => readHex(b, o) }
}

/// MAIN ///

export function decode(type: DecoderType, buffer: Buffer | Uint8Array, offset: number) {
    if (type === "list") throw new Error("List used incorrectly")

    debugLog(offset, type, buffer.slice(offset, offset + 4))
    const data = decoders[type].decode(buffer, offset)
    debugLog(offset, data.value)

    return data
}

/// DECODERS ///

export const readString = (buffer: Uint8Array, offset: number) => {
    const readLength = readInt(buffer, offset)
    let length = readLength.value
    offset += readLength.bytes

    if (!length) return { value: "", bytes: readLength.bytes }

    let encoding = "utf-8"
    // null-termination: one byte if UTF-8, two bytes if UTF-16
    let termination = 1

    // if negative, text encoding is UTF-16, and actual length is multiplied by minus two
    if (length < 0) {
        length = length * -2
        encoding = "utf-16le"
        termination = 2
    }

    // probably not a string (helps in debugging)
    if (length > 10000) throw new Error("String too long!")

    const bytes = readLength.bytes + length
    const value = new TextDecoder(encoding).decode(buffer.slice(offset, offset + length - termination))
    return { value, bytes }
}

const readInt = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.int.bytes
    const value = new DataView(buffer.buffer).getInt32(offset, true) // little-endian
    return { value, bytes }
}

const readLong = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.int64.bytes
    const value = new DataView(buffer.buffer).getBigInt64(offset, true) // little-endian
    return { value: Number(value), bytes }
}

const readFloat = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.float.bytes
    const value = new DataView(buffer.buffer).getFloat32(offset, true) // little-endian
    return { value, bytes }
}

const readDouble = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.float64.bytes
    const value = new DataView(buffer.buffer).getFloat64(offset, true) // little-endian
    return { value, bytes }
}

const readMD5 = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.md5.bytes
    const value = toHex(buffer.slice(offset, offset + bytes))
    return { value, bytes }
}

const readByte = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.byte.bytes
    // const value = new DataView(buffer.buffer).getUint8(offset)
    const value = buffer[offset]
    return { value, bytes }
}

const readHex = (buffer: Uint8Array, offset: number) => {
    const bytes = decoders.hex.bytes
    const value = toHex(buffer.slice(offset, offset + bytes))
    return { value, bytes }
}

/// HELPERS ///

export function toHex(value: Uint8Array<ArrayBuffer>) {
    return Array.from(value)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}
