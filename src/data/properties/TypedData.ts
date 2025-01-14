import { $objectReference } from "../Object"
import type { DataObject } from "./../DataTypes"

export type TypedDataTypes = keyof typeof $typedData

export const $typedData: { [key: string]: DataObject } = {
    Box: {
        minX: { type: "float64" },
        minY: { type: "float64" },
        minZ: { type: "float64" },
        maxX: { type: "float64" },
        maxY: { type: "float64" },
        maxZ: { type: "float64" },
        isValid: { type: "byte" }
    },
    FluidBox: {
        value: { type: "float" }
    },
    InventoryItem: {
        padding: { type: "int" },
        itemName: { type: "string" },
        hasPropertiesList: { type: "int" }
        // custom data
    },
    LinearColor: {
        r: { type: "float" },
        g: { type: "float" },
        b: { type: "float" },
        a: { type: "float" }
    },
    Quat: {
        x: { type: "float" },
        unknownInt: { type: "int" },
        y: { type: "float" },
        unknownInt2: { type: "int" },
        z: { type: "float" },
        unknownInt3: { type: "int" },
        w: { type: "float" },
        unknownInt4: { type: "int" }
    },
    RailroadTrackPosition: {
        ...$objectReference,
        offset: { type: "float" },
        forward: { type: "float" }
    },
    Vector: {
        x: { type: "float" },
        y: { type: "float" },
        z: { type: "float" },
        unknownX: { type: "float" },
        unknownY: { type: "float" },
        unknownZ: { type: "float" }
    },
    DateTime: {
        value: { type: "int64" }
    },
    ClientIdentityInfo: {
        UUID: { type: "string" },
        identityCount: { type: "int" },
        identity: { type: "list" }
    }
}

export const $identity: DataObject = {
    gameStore: { type: "byte" },
    identityDataSize: { type: "int" }
    // identity data
}

export const $inventoryItemPropertyList: DataObject = {
    padding: { type: "int" }, // 0
    itemType: { type: "string" },
    propertySize: { type: "int" },
    propertyList: { type: "list" }
}

export const $inventoryItemProperty: DataObject = {
    // property data
    name: { type: "string" },
    type: { type: "string" },

    property: { type: "list" }
}
