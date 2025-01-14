import { getObjectReference } from "../../parser/common"
import type { DataObject } from "../DataTypes"
import { $objectReference } from "../Object"

export const $actorObjectFormat: { [key: string]: DataObject } = {
    Conveyor: {
        length: { type: "int" },
        name: { type: "string" },
        emptyString: { type: "string" },
        emptyString2: { type: "string" },
        floatPosition: { type: "float" }
    },
    Game: {
        ...$objectReference
    },
    DroneTransport: {
        unknownInt: { type: "int" }, // 0
        unknownInt2: { type: "int" }, // 0
        extraData: { type: "int" }, // 0/1
        action: { type: "string" } // DroneAction_TakeoffSequence
    },
    CircuitSubsystem: {
        number: { type: "int" },
        ...$objectReference
    },
    PowerLine: {
        ...getObjectReference("startingPole"),
        ...getObjectReference("endingPole")
    },
    TrainLocomotive: {
        unknownInt: { type: "int" }, // 0
        unknownInt2: { type: "int" }, // 0
        unknownInt3: { type: "int" }, // 0
        unknownInt4: { type: "int" }, // 0
        ...$objectReference
    },
    TrainFreightWagon: {
        unknownInt: { type: "int" }, // 0
        unknownInt2: { type: "int" }, // 0
        ...$objectReference,
        ...getObjectReference("locomotive")
    },
    BuildableSubsystem: {
        rotationX: { type: "float64" },
        rotationY: { type: "float64" },
        rotationZ: { type: "float64" },
        rotationW: { type: "float64" },
        positionX: { type: "float64" },
        positionY: { type: "float64" },
        positionZ: { type: "float64" },
        scaleX: { type: "float64" },
        scaleY: { type: "float64" },
        scaleZ: { type: "float64" },

        alwaysZero: { type: "int" },

        swatchName: { type: "string" },

        alwaysZero2: { type: "int" },
        alwaysZero3: { type: "int" },
        alwaysZero4: { type: "int" },

        patternDescriptionNumber: { type: "string" },

        alwaysZero5: { type: "int" },
        alwaysZero6: { type: "int" },

        primaryColor1: { type: "float" },
        primaryColor2: { type: "float" },
        primaryColor3: { type: "float" },
        primaryColor4: { type: "float" },

        secondaryColor1: { type: "float" },
        secondaryColor2: { type: "float" },
        secondaryColor3: { type: "float" },
        secondaryColor4: { type: "float" },

        alwaysZero7: { type: "int" },
        dataSize: { type: "int" }, // this is reduced if paint
        // unknown data

        unknownInt: { type: "int" },
        alwaysZero8: { type: "byte" },

        recipe: { type: "string" },
        ...getObjectReference("blueprintProxy")
    },
    ConveyorChainActor: {
        ...getObjectReference("startingBelt"),
        ...getObjectReference("endingBelt"),

        beltsInChain: { type: "int" },
        belts: { type: "list" },

        unknownInt: { type: "int" },
        int1: { type: "int" },
        int2: { type: "int" },
        int3: { type: "int" },

        itemCount: { type: "int" },
        items: { type: "list" }
    }
}
