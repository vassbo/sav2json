import type { DataObject, GenericObject } from "../data/DataTypes"
import { $objectReference } from "../data/Object"
import { decode } from "../decoders/decoders"

export function decodeGeneric(data: DataObject, BUFFER: Buffer | Uint8Array, OFFSET: number) {
    let startOffset = OFFSET
    let object: GenericObject = {}

    Object.entries(data).forEach(([key, data]) => {
        const decoded = decode(data.type, BUFFER, OFFSET)
        OFFSET += decoded.bytes
        object[key] = decoded.value
    })

    return { value: object, bytes: OFFSET - startOffset }
}

export function decodeGenericList(data: DataObject, BUFFER: Buffer | Uint8Array, OFFSET: number, count: number) {
    let startOffset = OFFSET
    let objectArray: GenericObject[] = []

    for (let i = 0; i < count; i++) {
        const decoded = decodeGeneric(data, BUFFER, OFFSET)
        OFFSET += decoded.bytes
        objectArray.push(decoded.value)
    }

    return { value: objectArray, bytes: OFFSET - startOffset }
}

export function decodeObjectReferenceList(BUFFER: Buffer | Uint8Array, OFFSET: number, count: number) {
    return decodeGenericList($objectReference, BUFFER, OFFSET, count)
}

export function getObjectReference(name: string) {
    return {
        [`${name}LevelName`]: { type: "string" },
        [`${name}PathName`]: { type: "string" }
    } as DataObject
}

///

export function unmatchingSize(dataType: string, dataValue: any, actualValue: any) {
    return `${dataType} does not match actual size: ${dataValue} !== ${actualValue}`
}

export const DEBUG = false
export function debugLog(OFFSET: number, ...value: any[]) {
    if (!DEBUG) return

    const MIN_OFFSET = 0 // 3500000
    if (OFFSET > MIN_OFFSET) console.log("DEBUG", OFFSET, "---", ...value)
}
