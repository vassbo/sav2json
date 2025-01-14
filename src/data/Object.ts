import { getObjectReference } from "../parser/common"
import type { DataObject } from "./DataTypes"

export const $objectHeader: DataObject = {
    headerType: { type: "int" }
    // header bytes
}

export const $objectReference: DataObject = {
    levelName: { type: "string" }, // "Persistent_Level" / 25 char ID
    pathName: { type: "string" } // "Persistent_Level:PersistentLevel...
}

export const $actorHeader: DataObject = {
    typePath: { type: "string" },
    rootObject: { type: "string" },
    instanceName: { type: "string" },
    needTransform: { type: "int" },
    rotationX: { type: "float" },
    rotationY: { type: "float" },
    rotationZ: { type: "float" },
    rotationW: { type: "float" },
    positionX: { type: "float" },
    positionY: { type: "float" },
    positionZ: { type: "float" },
    scaleX: { type: "float" },
    scaleY: { type: "float" },
    scaleZ: { type: "float" },
    wasPlacedInLevel: { type: "int" }
}

export const $actorObject: DataObject = {
    saveVersion: { type: "int" },
    flag: { type: "int" },
    size: { type: "int" },
    ...getObjectReference("parent"),

    componentCount: { type: "int" },
    components: { type: "list" },
    properties: { type: "list" }
    // trailing bytes
}

export const $componentHeader: DataObject = {
    typePath: { type: "string" },
    rootObject: { type: "string" },
    instanceName: { type: "string" },
    parentActorName: { type: "string" }
}

export const $componentObject: DataObject = {
    saveVersion: { type: "int" },
    flag: { type: "int" },
    size: { type: "int" },

    properties: { type: "list" },
    alwaysZero: { type: "int" }
    // trailing bytes
}
