import type { GenericObject } from "../../data/DataTypes"
import type { PropertyType } from "../../data/properties/PropertyData"
import { $identity, $inventoryItemProperty, $inventoryItemPropertyList, $typedData, TypedDataTypes } from "../../data/properties/TypedData"
import { decode } from "../../decoders/decoders"
import { unmatchingSize } from "../common"
import { decodePropertyList, decodePropertyValue } from "./propertyList"

export function decodeTypedData(type: TypedDataTypes, BUFFER: Buffer | Uint8Array, OFFSET: number, parent: PropertyType) {
    let startOffset = OFFSET

    let dataValues = $typedData[type]

    // all other types represent a PropertyList
    if (!dataValues) {
        let decoded = decodePropertyList(BUFFER, OFFSET)
        OFFSET += decoded.bytes
        return { value: decoded.value, bytes: OFFSET - startOffset }
    }

    let object: GenericObject = {}
    Object.entries(dataValues).forEach(([key, data]) => {
        let decoded

        if (key === "properties") decoded = decodePropertyList(BUFFER, OFFSET)
        else if (key === "identity") decoded = decodeIdentityInfo(BUFFER, OFFSET, object.identityCount)
        else decoded = decode(data.type, BUFFER, OFFSET)

        OFFSET += decoded.bytes
        object[key] = decoded.value
    })

    // this extra property is only present if the InventoryItem is part of the payload of a StructProperty
    if (type === "InventoryItem" && parent === "StructProperty") {
        let decodedInventoryItem = getInventoryItemProperty(object.hasPropertiesList === 1, BUFFER, OFFSET)
        OFFSET += decodedInventoryItem.bytes
        object.property = decodedInventoryItem.value
    }

    return { value: object, bytes: OFFSET - startOffset }
}

function decodeIdentityInfo(BUFFER: Buffer | Uint8Array, OFFSET: number, count: number) {
    let startOffset = OFFSET
    let objectArray: GenericObject[] = []

    for (let i = 0; i < count; i++) {
        let object: GenericObject = {}

        Object.entries($identity).forEach(([key, data]) => {
            const decoded = decode(data.type, BUFFER, OFFSET)
            OFFSET += decoded.bytes
            object[key] = decoded.value

            if (key === "identityDataSize") OFFSET += Number(decoded.value)
        })

        objectArray.push(object)
    }

    return { value: objectArray, bytes: OFFSET - startOffset }
}

function getInventoryItemProperty(hasPropertiesList: boolean, BUFFER: Buffer | Uint8Array, OFFSET: number) {
    let startOffset = OFFSET
    let propertyData: GenericObject = {}

    const $property = hasPropertiesList ? $inventoryItemPropertyList : $inventoryItemProperty

    Object.entries($property).forEach(([key, data]) => {
        let decoded
        if (key === "propertyList") decoded = decodePropertyList(BUFFER, OFFSET)
        else if (key === "property") decoded = decodePropertyValue(propertyData.type, BUFFER, OFFSET)
        else decoded = decode(data.type, BUFFER, OFFSET)

        OFFSET += decoded.bytes

        propertyData[key] = decoded.value

        /// VALIDATE ///
        if (key === "propertyList" && propertyData.propertySize !== decoded.bytes) {
            throw new Error(unmatchingSize("Property size", propertyData.propertySize, decoded.bytes))
        } else if ((key === "name" && decoded.value !== "NumItems") || (key === "type" && decoded.value !== "IntProperty")) {
            throw new Error("Looks like a pre 1.0 world!") // "Incorrect InventoryItem value"
        }
    })

    return { value: propertyData, bytes: OFFSET - startOffset }
}
