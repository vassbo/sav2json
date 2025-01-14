import type { GenericObject } from "../../data/DataTypes"
import { $propertyTypeData, PropertyType } from "../../data/properties/PropertyData"
import { decode } from "../../decoders/decoders"
import { debugLog, decodeGeneric, unmatchingSize } from "../common"
import { propertyDecoders } from "./lists"
import { decodeTypedData } from "./typedData"

export const decodePropertyList = (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
    let startOffset = OFFSET
    let objectArray: GenericObject[] = []

    // loop until hitting "None" breaker
    while (true) {
        let name = decode("string", BUFFER, OFFSET)
        OFFSET += name.bytes
        // object.name = name.value

        if (name.value === "None") break

        let type = decode("string", BUFFER, OFFSET)
        OFFSET += type.bytes
        // // object.type = type.value

        debugLog(OFFSET, name, type)

        let decoded = decodePropertyValue(type.value as PropertyType, BUFFER, OFFSET)
        OFFSET += decoded.bytes

        objectArray.push(decoded.value)
    }

    return { value: objectArray, bytes: OFFSET - startOffset }
}

export function decodePropertyValue(type: PropertyType, BUFFER: Buffer | Uint8Array, OFFSET: number) {
    let startOffset = OFFSET
    let propertyValue: GenericObject = {}

    let decoded
    if (propertyDecoders[type]) decoded = propertyDecoders[type](BUFFER, OFFSET)
    else if ($propertyTypeData[type]) decoded = decodeGeneric($propertyTypeData[type], BUFFER, OFFSET)
    else throw new Error("Unknown property type: " + type)

    OFFSET += decoded.bytes
    propertyValue = decoded.value

    // Custom property data
    if (type === "ByteProperty") {
        let byteType = decoded.value.type
        let decodedData
        // if type is "None", then it's just a Byte, otherwise a String
        if (byteType === "None") decodedData = decode("byte", BUFFER, OFFSET)
        else decodedData = decode("string", BUFFER, OFFSET)

        OFFSET += decodedData.bytes
        propertyValue.value = decodedData.value
    } else if (type === "StructProperty") {
        let decodedData = decodeTypedData(propertyValue.type, BUFFER, OFFSET, type)
        OFFSET += decodedData.bytes
        propertyValue = { ...propertyValue, ...decodedData.value }
    }

    /// VALIDATE ///
    if (type === "TextProperty" && propertyValue.size !== OFFSET - startOffset - 9) {
        throw new Error(unmatchingSize("Text value" + type, propertyValue.size, OFFSET - startOffset - 9))
    }

    return { value: propertyValue, bytes: OFFSET - startOffset }
}
