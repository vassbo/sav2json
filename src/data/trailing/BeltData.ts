import { getObjectReference } from "../../parser/common"
import type { DataObject } from "../DataTypes"

export const $belt: DataObject = {
    // (the same reference for each belt)
    ...getObjectReference("conveyorChainActor"),
    ...getObjectReference("belt"),

    elementCount: { type: "int" },
    elements: { type: "list" },

    // UInt32
    int1: { type: "int" },
    int2: { type: "int" },
    int3: { type: "int" },
    // Int
    int4: { type: "int" },
    int5: { type: "int" },

    beltIndex: { type: "int" }
}

// 9 Uint64s in 3 groups of 3
export const $beltElement: DataObject = {
    int1_1: { type: "int64" },
    int1_2: { type: "int64" },
    int1_3: { type: "int64" },

    int2_1: { type: "int64" },
    int2_2: { type: "int64" },
    int2_3: { type: "int64" },

    int3_1: { type: "int64" },
    int3_2: { type: "int64" },
    int3_3: { type: "int64" }
}

export const $beltItems: DataObject = {
    alwaysZero: { type: "int" }, // 0
    itemName: { type: "string" },
    alwaysZero2: { type: "int" }, // 0
    unknownInt: { type: "int" }
}
