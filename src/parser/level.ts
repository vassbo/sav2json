import type { GenericObject } from "../data/DataTypes"
import { $level, $levelGroupingGrid, $levelGroupingInfo } from "../data/Level"
import { decode } from "../decoders/decoders"
import { decodeGenericList, decodeObjectReferenceList, unmatchingSize } from "./common"
import { decodeObjectHeaders, decodeObjects } from "./object"

export function decodeLevels(BUFFER: Buffer | Uint8Array, OFFSET: number, levelsCount: number) {
    let startOffset = OFFSET
    let levels: GenericObject[] = []

    for (let i = 0; i < levelsCount; i++) {
        // last level is PersistentLevel
        const isPersistentLevel = i === levelsCount - 1
        let levelObject: GenericObject = {}

        Object.entries($level).forEach(([key, data]) => {
            // the sublevel name field is absent in PersistentLevel
            if (key === "sublevelName" && isPersistentLevel) return

            if (key === "collectables" && decode("int", BUFFER, OFFSET).value === 0) throw new Error("Looks like a pre 1.0 world!")

            let decoded
            if (key === "objectHeaders") decoded = decodeObjectHeaders(BUFFER, OFFSET, levelObject.objectHeaderCount)
            else if (key === "collectables") decoded = decodeObjectReferenceList(BUFFER, OFFSET, levelObject.collectablesCount)
            else if (key === "objects") decoded = decodeObjects(BUFFER, OFFSET, levelObject.objectCount, levelObject.objectHeaders)
            else if (key === "secondCollectables") decoded = decodeObjectReferenceList(BUFFER, OFFSET, levelObject.secondCollectablesCount)
            else decoded = decode(data.type, BUFFER, OFFSET)

            OFFSET += decoded.bytes
            levelObject[key] = decoded.value

            /// VALIDATE ///
            if (key === "objectCount" && Number(decoded.value) !== levelObject.objectHeaderCount) {
                throw new Error(`Object count does not match object header count: ${decoded.value} !== ${levelObject.objectHeaderCount}`)
            } else if (key === "objects" && levelObject.objectsSize !== decoded.bytes + 4) {
                throw new Error(unmatchingSize("Object size", levelObject.objectsSize, decoded.bytes + 4))
            }
        })

        /// VALIDATE /// (can't get this to match)
        // if (levelObject.objectHeaderAndCollectablesSize !== OFFSET - levelStartOffset) {
        //     throw new Error(unmatchingSize("Object header/collectables size", levelObject.objectHeaderAndCollectablesSize, OFFSET - levelStartOffset))
        // }

        levels.push(levelObject)
    }

    return { value: levels, bytes: OFFSET - startOffset }
}

// "MainGrid", "LandscapeGrid", "ExplorationGrid", "FoliageGrid", "HLOD0_256m_1023m"
const LEVEL_GROUPING_GRIDS = 5
export function decodeLevelGroupingGrids(BUFFER: Buffer | Uint8Array, OFFSET: number) {
    let startOffset = OFFSET
    let levelGroupingGrids: GenericObject[] = []

    for (let i = 0; i < LEVEL_GROUPING_GRIDS; i++) {
        let levelGrouping: GenericObject = {}

        Object.entries($levelGroupingGrid).forEach(([key, data]) => {
            let decoded
            if (key === "levelInfo") decoded = decodeGenericList($levelGroupingInfo, BUFFER, OFFSET, levelGrouping.levelCount)
            else decoded = decode(data.type, BUFFER, OFFSET)

            OFFSET += decoded.bytes
            levelGrouping[key] = decoded.value
        })

        levelGroupingGrids.push(levelGrouping)
    }

    return { value: levelGroupingGrids, bytes: OFFSET - startOffset }
}
