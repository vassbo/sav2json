import { decoders } from "../decoders/decoders"

export type GenericObject = {
    [key: string]: any
}

// "list" type is an array of normal decoders
export type DecoderType = keyof typeof decoders | "list"

type Data = {
    type: DecoderType
}
export type DataObject = {
    [key: string]: Data
}

type Value = string | number | ArrayBuffer
export interface Decoded {
    value: Value
    bytes: number
}

export type ObjectType = "ActorObject" | "ComponentObject"
