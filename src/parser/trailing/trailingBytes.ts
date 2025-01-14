import type { DataObject, GenericObject, ObjectType } from "../../data/DataTypes"
import { $beltItems } from "../../data/trailing/BeltData"
import { $actorObjectFormat } from "../../data/trailing/TrailingData"
import { decode } from "../../decoders/decoders"
import { decodeGeneric, decodeGenericList } from "../common"
import { decodePropertyList } from "../property/propertyList"
import { decodeBelts } from "./belts"

const GAME_PRESET = "/Game/FactoryGame/"
const SCRIPT_PRESET = "/Script/FactoryGame.FG"
const FACTORY_BUILDABLE = GAME_PRESET + "Buildable/Factory/"
const VEHICLE_BUILDABLE = GAME_PRESET + "Buildable/Vehicle/"
const CONVEYORS = [...Array(6)]
    .map((_, i) => [FACTORY_BUILDABLE + `ConveyorBeltMk${i + 1}/Build_ConveyorBeltMk${i + 1}.Build_ConveyorBeltMk${i + 1}_C`, FACTORY_BUILDABLE + `ConveyorLiftMk${i + 1}/Build_ConveyorLiftMk${i + 1}.Build_ConveyorLiftMk${i + 1}_C`])
    .flat()

const ActorObjectFormats = {
    Conveyor: {
        names: CONVEYORS,
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            const length = decode("int", BUFFER, OFFSET)
            OFFSET += length.bytes

            const decoded = decodeGenericList($actorObjectFormat.Conveyor, BUFFER, OFFSET, Number(length.value))
            OFFSET += decoded.bytes

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    Game: {
        names: [GAME_PRESET + "-Shared/Blueprint/BP_GameMode.BP_GameMode_C", GAME_PRESET + "-Shared/Blueprint/BP_GameState.BP_GameState_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const length = decode("int", BUFFER, OFFSET)
            OFFSET += length.bytes

            const decoded = decodeGenericList($actorObjectFormat.Game, BUFFER, OFFSET, Number(length.value))
            OFFSET += decoded.bytes

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    PlayerState: {
        names: [GAME_PRESET + "Character/Player/BP_PlayerState.BP_PlayerState_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            const mode = decode("byte", BUFFER, OFFSET)
            OFFSET += mode.bytes

            if (mode.value === 3) return mode
            if (mode.value !== 241) throw new Error("Incorrect player state mode")

            const gameStore = decode("byte", BUFFER, OFFSET)
            OFFSET += gameStore.bytes

            const bytesRemaining = decode("int", BUFFER, OFFSET)
            OFFSET += bytesRemaining.bytes + Number(bytesRemaining.value)

            return { value: gameStore.value, bytes: OFFSET - startOffset }
        }
    },
    DroneTransport: {
        names: [FACTORY_BUILDABLE + "DroneStation/BP_DroneTransport.BP_DroneTransport_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const decoded = decodeGeneric($actorObjectFormat.DroneTransport, BUFFER, OFFSET)
            OFFSET += decoded.bytes

            if (decoded.value.extraData) {
                const stationData = decodePropertyList(BUFFER, OFFSET)
                OFFSET += stationData.bytes

                const dataListCount = decode("int", BUFFER, OFFSET)
                OFFSET += dataListCount.bytes

                for (let i = 0; i < Number(dataListCount.value); i++) {
                    const actionName = decode("string", BUFFER, OFFSET)
                    OFFSET += actionName.bytes

                    const destinationData = decodePropertyList(BUFFER, OFFSET)
                    OFFSET += destinationData.bytes
                }
            }

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    CircuitSubsystem: {
        names: [GAME_PRESET + "-Shared/Blueprint/BP_CircuitSubsystem.BP_CircuitSubsystem_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            const length = decode("int", BUFFER, OFFSET)
            OFFSET += length.bytes

            const decoded = decodeGenericList($actorObjectFormat.CircuitSubsystem, BUFFER, OFFSET, Number(length.value))
            OFFSET += decoded.bytes

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    PowerLine: {
        names: [FACTORY_BUILDABLE + "PowerLine/Build_PowerLine.Build_PowerLine_C", GAME_PRESET + "Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            const decoded = decodeGeneric($actorObjectFormat.PowerLine, BUFFER, OFFSET)
            OFFSET += decoded.bytes

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    TrainLocomotive: {
        names: [VEHICLE_BUILDABLE + "Train/Locomotive/BP_Locomotive.BP_Locomotive_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const decoded = decodeGeneric($actorObjectFormat.TrainLocomotive, BUFFER, OFFSET)
            OFFSET += decoded.bytes

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    TrainFreightWagon: {
        names: [VEHICLE_BUILDABLE + "Train/Wagon/BP_FreightWagon.BP_FreightWagon_C"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const decoded = decodeGeneric($actorObjectFormat.TrainFreightWagon, BUFFER, OFFSET)
            OFFSET += decoded.bytes

            return { value: decoded.value, bytes: OFFSET - startOffset }
        }
    },
    Transport: {
        names: [
            VEHICLE_BUILDABLE + "Cyberwagon/Testa_BP_WB.Testa_BP_WB_C",
            VEHICLE_BUILDABLE + "Explorer/BP_Explorer.BP_Explorer_C",
            VEHICLE_BUILDABLE + "Golfcart/BP_Golfcart.BP_Golfcart_C",
            VEHICLE_BUILDABLE + "Tractor/BP_Tractor.BP_Tractor_C",
            VEHICLE_BUILDABLE + "Truck/BP_Truck.BP_Truck_C"
        ],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const length = decode("int", BUFFER, OFFSET)
            OFFSET += length.bytes

            let objectArray: GenericObject[] = []
            for (let i = 0; i < Number(length.value); i++) {
                const number = decode("int", BUFFER, OFFSET)
                const FIXED_BYTES = 105
                OFFSET += number.bytes + FIXED_BYTES

                objectArray.push({ number: number.value })
            }

            return { value: objectArray, bytes: OFFSET - startOffset }
        }
    },
    ItemPickup: {
        names: [SCRIPT_PRESET + "ItemPickup_Spawnable"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            return { value: "", bytes: 4 }
        }
    },
    BuildableSubsystem: {
        names: [SCRIPT_PRESET + "LightweightBuildableSubsystem"],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET

            const padding = decode("int", BUFFER, OFFSET)
            OFFSET += padding.bytes
            const elementCount = decode("int", BUFFER, OFFSET)
            OFFSET += elementCount.bytes

            let elements: GenericObject[] = []
            for (let i = 0; i < Number(elementCount.value); i++) {
                const alwaysZero = decode("int", BUFFER, OFFSET)
                OFFSET += alwaysZero.bytes
                const name = decode("string", BUFFER, OFFSET)
                OFFSET += name.bytes
                const itemCount = decode("int", BUFFER, OFFSET)
                OFFSET += itemCount.bytes

                let items: GenericObject[] = []
                for (let i = 0; i < Number(itemCount.value); i++) {
                    let itemData: DataObject = {}
                    Object.entries($actorObjectFormat.BuildableSubsystem).forEach(([key, data]) => {
                        let decoded = decode(data.type, BUFFER, OFFSET)
                        OFFSET += decoded.bytes
                        itemData[key] = decoded.value as any

                        if (key === "dataSize") OFFSET += Number(decoded.value)
                    })
                    items.push(itemData)
                }
                elements.push(items)
            }

            return { value: elements, bytes: OFFSET - startOffset }
        }
    },
    ConveyorChainActor: {
        names: [
            SCRIPT_PRESET + "ConveyorChainActor",
            SCRIPT_PRESET + "ConveyorChainActor_RepSizeNoCull",
            SCRIPT_PRESET + "ConveyorChainActor_RepSizeMedium",
            SCRIPT_PRESET + "ConveyorChainActor_RepSizeLarge",
            SCRIPT_PRESET + "ConveyorChainActor_RepSizeHuge"
        ],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            let startOffset = OFFSET
            let object: GenericObject = {}

            const checkPadding = decode("int", BUFFER, OFFSET)
            if (checkPadding.value === 0) OFFSET += 4

            Object.entries($actorObjectFormat.ConveyorChainActor).forEach(([key, data]) => {
                let decoded
                if (key === "belts") decoded = decodeBelts(object.beltsInChain, BUFFER, OFFSET)
                else if (key === "items") decoded = decodeGenericList($beltItems, BUFFER, OFFSET, object.itemCount)
                else decoded = decode(data.type, BUFFER, OFFSET)

                OFFSET += decoded.bytes
                object[key] = decoded.value
            })

            return { value: object, bytes: OFFSET - startOffset }
        }
    }
}

const ComponentObjectFormats = {
    Components: {
        names: [
            SCRIPT_PRESET + "DroneMovementComponent",
            SCRIPT_PRESET + "FactoryConnectionComponent",
            SCRIPT_PRESET + "FactoryLegsComponent",
            SCRIPT_PRESET + "HealthComponent",
            SCRIPT_PRESET + "InventoryComponent",
            SCRIPT_PRESET + "InventoryComponentEquipment",
            SCRIPT_PRESET + "InventoryComponentTrash",
            SCRIPT_PRESET + "PipeConnectionComponent",
            SCRIPT_PRESET + "PipeConnectionComponentHyper",
            SCRIPT_PRESET + "PipeConnectionFactory",
            SCRIPT_PRESET + "PowerConnectionComponent",
            SCRIPT_PRESET + "PowerInfoComponent",
            SCRIPT_PRESET + "RailroadTrackConnectionComponent",
            SCRIPT_PRESET + "ShoppingListComponent",
            SCRIPT_PRESET + "TrainPlatformConnection"
        ],
        decode: (BUFFER: Buffer | Uint8Array, OFFSET: number) => {
            const alwaysZero = decode("int", BUFFER, OFFSET)
            return alwaysZero
        }
    }
}

export function getTrailingBytes(objectType: ObjectType, objectName: string, BUFFER: Buffer | Uint8Array, OFFSET: number) {
    const objectData = objectType === "ActorObject" ? ActorObjectFormats : ComponentObjectFormats
    if (!objectData) throw new Error("Missing trailing bytes data: " + objectName)

    const objectMatch = Object.values(objectData).find((a) => a.names.includes(objectName))
    if (!objectMatch) {
        const checkPadding = decode("int", BUFFER, OFFSET)
        if (checkPadding.value === 0 && !objectName.includes("BlueprintShortcut") && !objectName.includes("Emote")) return { value: "", bytes: checkPadding.bytes }
        return { value: "", bytes: 0 }
    }

    const decoded = objectMatch.decode(BUFFER, OFFSET)
    return decoded
}
