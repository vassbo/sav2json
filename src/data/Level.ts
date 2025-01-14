import type { DataObject } from "./DataTypes"

export const $level: DataObject = {
    sublevelName: { type: "string" },
    objectHeaderAndCollectablesSize: { type: "int64" },

    objectHeaderCount: { type: "int" },
    objectHeaders: { type: "list" },

    collectablesCount: { type: "int" },
    collectables: { type: "list" },

    objectsSize: { type: "int64" },
    objectCount: { type: "int" },
    objects: { type: "list" },

    secondCollectablesCount: { type: "int" },
    secondCollectables: { type: "list" }
}

export const $levelGroupingGrid: DataObject = {
    gridName: { type: "string" },
    unknownInt: { type: "int" },
    unknownInt2: { type: "int" },
    levelCount: { type: "int" },
    levelInfo: { type: "list" }
}

export const $levelGroupingInfo: DataObject = {
    sublevelName: { type: "string" },
    levelInfoInt: { type: "int" }
}
