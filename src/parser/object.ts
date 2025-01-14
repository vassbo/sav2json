import type { GenericObject, ObjectType } from "../data/DataTypes"
import { $actorHeader, $actorObject, $componentHeader, $componentObject, $objectHeader } from "../data/Object"
import { decode } from "../decoders/decoders"
import { getTrailingBytes } from "./trailing/trailingBytes"
import { decodeGeneric, decodeObjectReferenceList, unmatchingSize } from "./common"
import { decodePropertyList } from "./property/propertyList"

export function decodeObjectHeaders(BUFFER: Buffer | Uint8Array, OFFSET: number, count: number) {
    let startOffset = OFFSET
    let objectHeaders: GenericObject[] = []

    for (let i = 0; i < count; i++) {
        let objectHeader: GenericObject = {}

        Object.entries($objectHeader).forEach(([key, data]) => {
            const decoded = decode(data.type, BUFFER, OFFSET)

            OFFSET += decoded.bytes
            objectHeader[key] = decoded.value

            if (key === "headerType") {
                let header
                if (decoded.value === 0) header = decodeGeneric($componentHeader, BUFFER, OFFSET)
                else if (decoded.value === 1) header = decodeGeneric($actorHeader, BUFFER, OFFSET)
                else throw new Error("Invalid header type: " + decoded.value)

                OFFSET += header.bytes
                objectHeader = { ...objectHeader, ...header.value }
            }
        })

        objectHeaders.push(objectHeader)
    }

    return { value: objectHeaders, bytes: OFFSET - startOffset }
}

export function decodeObjects(BUFFER: Buffer | Uint8Array, OFFSET: number, count: number, headers: GenericObject) {
    let startOffset = OFFSET
    let objectArray: GenericObject[] = []

    for (let i = 0; i < count; i++) {
        let currentOffset = OFFSET
        let object: GenericObject = {}
        let header = headers[i]

        let objectType: ObjectType = header.rotationX !== undefined ? "ActorObject" : "ComponentObject"
        let $object = objectType === "ActorObject" ? $actorObject : $componentObject

        // OBJECT
        Object.entries($object).forEach(([key, data]) => {
            let decoded

            if (key === "components") decoded = decodeObjectReferenceList(BUFFER, OFFSET, object.componentCount)
            else if (key === "properties") decoded = decodePropertyList(BUFFER, OFFSET)
            else decoded = decode(data.type, BUFFER, OFFSET)

            OFFSET += decoded.bytes
            object[key] = decoded.value
        })

        // TRAILING BYTES
        const trailingBytes = object.size - (OFFSET - currentOffset - 12)
        const decodedBytes = getTrailingBytes(objectType, header.typePath, BUFFER, OFFSET)
        OFFSET += decodedBytes.bytes
        object.trailing = decodedBytes.value

        /// VALIDATE ///
        if (trailingBytes !== decodedBytes.bytes) {
            throw new Error(unmatchingSize("Bytes", trailingBytes, decodedBytes.bytes) + `: ${header.typePath}`)
        }

        objectArray.push(object)
    }

    return { value: objectArray, bytes: OFFSET - startOffset }
}
