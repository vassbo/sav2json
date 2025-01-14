import type { GenericObject } from "../../data/DataTypes"
import { $belt, $beltElement } from "../../data/trailing/BeltData"
import { decodeGenericList } from "../common"
import { decode } from "../../decoders/decoders"

export function decodeBelts(count: number, BUFFER: Buffer | Uint8Array, OFFSET: number) {
    let startOffset = OFFSET

    let beltsArray: GenericObject[] = []
    for (let i = 0; i < Number(count); i++) {
        let beltObject: GenericObject = {}
        Object.entries($belt).forEach(([key, data]) => {
            let decoded
            if (key === "elements") decoded = decodeGenericList($beltElement, BUFFER, OFFSET, beltObject.elementCount)
            else decoded = decode(data.type, BUFFER, OFFSET)

            OFFSET += decoded.bytes
            beltObject[key] = decoded.value
        })

        beltsArray.push(beltObject)
    }

    return { value: beltsArray, bytes: OFFSET - startOffset }
}
