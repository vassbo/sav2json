import type { GenericObject } from "../../data/DataTypes"
import { $arrayProperty, $mapPropertyKey, $mapPropertyValue, $propertyTypeData, $setProperty } from "../../data/properties/PropertyData"
import { decode } from "../../decoders/decoders"
import { decodeGeneric, unmatchingSize } from "../common"
import { decodePropertyList } from "./propertyList"
import { decodeTypedData } from "./typedData"

export const propertyDecoders: { [key: string]: any } = {
    ArrayProperty: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
        let startOffset = OFFSET
        let objectValue: GenericObject = {}

        let objectHead: GenericObject = {}
        Object.entries($propertyTypeData.ArrayProperty).forEach(([key, data]) => {
            const decoded = decode(data.type, BUFFER, OFFSET)
            OFFSET += decoded.bytes
            objectHead[key] = decoded.value
        })
        // objectValue.head = objectHead

        let values = $arrayProperty[objectHead.type]
        if (!values) throw new Error("Missing array value type: " + objectHead.type)

        const arraySizeStart = OFFSET - 4 // include "arrayLength" key

        if (objectHead.type === "StructProperty") {
            Object.entries(values).forEach(([key, data]) => {
                let decoded = decode(data.type, BUFFER, OFFSET)
                OFFSET += decoded.bytes
                objectValue[key] = decoded.value
            })

            values = { typedData: { type: "list" } }
        }

        let dataOffset = OFFSET
        let objectList: GenericObject[] = []
        for (let i = 0; i < objectHead.arrayLength; i++) {
            let listData: GenericObject = {}

            Object.entries(values).forEach(([key, data]) => {
                let decoded
                if (key === "typedData") decoded = decodeTypedData(objectValue.elementType, BUFFER, OFFSET, "ArrayProperty")
                else decoded = decode(data.type, BUFFER, OFFSET)

                OFFSET += decoded.bytes
                listData[key] = decoded.value
            })

            if (objectHead.type === "StructProperty") objectList.push(...(Object.values(listData.typedData) as any))
            else objectList.push(listData)
        }
        objectValue = { ...objectValue, ...objectList }

        /// VALIDATE ///
        if (objectHead.type === "StructProperty" && objectValue.size !== OFFSET - dataOffset) {
            throw new Error(unmatchingSize("Typed data", objectValue.size, OFFSET - dataOffset))
        }
        if (objectHead.size !== OFFSET - arraySizeStart) {
            throw new Error(unmatchingSize("Array size", objectHead.size, OFFSET - arraySizeStart))
        }

        return { value: objectValue, bytes: OFFSET - startOffset }
    },
    MapProperty: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
        let startOffset = OFFSET
        let object: GenericObject = {}

        Object.entries($propertyTypeData.MapProperty).forEach(([key, data]) => {
            const decoded = decode(data.type, BUFFER, OFFSET)
            OFFSET += decoded.bytes
            object[key] = decoded.value
        })

        const keyValues = $mapPropertyKey[object.keyType]
        if (!keyValues) throw new Error("Missing map key type: " + object.type)
        const valueValues = $mapPropertyValue[object.valueType]
        if (!valueValues) throw new Error("Missing map value type: " + object.type)

        const mapSizeStart = OFFSET - 8 // include "modeType" & "elementCount" key

        let list: any[] = []
        for (let i = 0; i < object.elementCount; i++) {
            let map: any = {}

            const decodedKeys = decodeGeneric(keyValues, BUFFER, OFFSET)
            OFFSET += decodedKeys.bytes
            map.key = decodedKeys.value

            let values: any[] = []
            Object.entries(valueValues).forEach(([key, data], i) => {
                let decoded
                if (key === "properties") decoded = decodePropertyList(BUFFER, OFFSET)
                else decoded = decode(data.type, BUFFER, OFFSET)

                OFFSET += decoded.bytes
                values.push(decoded.value)
            })
            map.value = values

            list.push(map)
        }
        object.map = list

        /// VALIDATE ///
        if (object.size !== OFFSET - mapSizeStart) {
            throw new Error(unmatchingSize("Map size", object.size, OFFSET - mapSizeStart))
        }

        return { value: object, bytes: OFFSET - startOffset }
    },
    SetProperty: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
        let startOffset = OFFSET
        let object: GenericObject = {}

        Object.entries($propertyTypeData.SetProperty).forEach(([key, data]) => {
            const decoded = decode(data.type, BUFFER, OFFSET)
            OFFSET += decoded.bytes
            object[key] = decoded.value
        })

        const values = $setProperty[object.type]
        if (!values) throw new Error("Missing set value type: " + object.type)

        const setSizeStart = OFFSET - 8 // include "padding" & "setLength" key

        let set: any[] = []
        for (let i = 0; i < object.setLength; i++) {
            const decodedSet = decodeGeneric(values, BUFFER, OFFSET)
            OFFSET += decodedSet.bytes
            set.push(...Object.values(decodedSet.value))
        }
        object.set = set

        /// VALIDATE ///
        if (object.size !== OFFSET - setSizeStart) {
            throw new Error(unmatchingSize("Set size", object.size, OFFSET - setSizeStart))
        }

        return { value: object, bytes: OFFSET - startOffset }
    }
}
