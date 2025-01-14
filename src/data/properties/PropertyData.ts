import type { DataObject } from "../DataTypes"
import { $objectReference } from "../Object"

export type PropertyType = keyof typeof $propertyTypeData // | keyof typeof propertyDecoders

export const $propertyTypeData = {
    ArrayProperty: {
        size: { type: "int" },
        index: { type: "int" },
        type: { type: "string" },
        padding: { type: "byte" }, // 0
        arrayLength: { type: "int" }
        // array elements
    } as DataObject,
    BoolProperty: {
        padding: { type: "int" }, // 0
        index: { type: "int" }, // 0
        value: { type: "byte" }, // 0 OR 1
        padding2: { type: "byte" } // 0
    } as DataObject,
    ByteProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        type: { type: "string" },
        padding: { type: "byte" } // 0
        // byte value (byte or string)
    } as DataObject,
    EnumProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        type: { type: "string" },
        padding: { type: "byte" }, // 0
        value: { type: "string" }
    } as DataObject,
    FloatProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "float" }
    } as DataObject,
    DoubleProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "float64" }
    } as DataObject,
    IntProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "int" }
    } as DataObject,
    Int8Property: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "byte" }
    } as DataObject,
    UInt32Property: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "int" }
    } as DataObject,
    Int64Property: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "int64" }
    } as DataObject,
    MapProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        keyType: { type: "string" },
        valueType: { type: "string" },
        padding: { type: "byte" }, // 0
        modeType: { type: "int" },
        elementCount: { type: "int" }
        // map elements
    } as DataObject,
    NameProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "string" }
    } as DataObject,
    ObjectProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        ...$objectReference
    } as DataObject,
    SoftObjectProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        ...$objectReference,
        value: { type: "int" }
    } as DataObject,
    SetProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        type: { type: "string" },
        padding: { type: "byte" }, // 0
        padding2: { type: "int" }, // 0
        setLength: { type: "int" }
        // set elements
    } as DataObject,
    StrProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        value: { type: "string" }
    } as DataObject,
    StructProperty: {
        size: { type: "int" },
        index: { type: "int" },
        type: { type: "string" },
        padding: { type: "int64" },
        padding2: { type: "int64" },
        padding3: { type: "byte" }
        // typed data
    } as DataObject,
    TextProperty: {
        size: { type: "int" },
        index: { type: "int" }, // 0
        padding: { type: "byte" }, // 0
        flags: { type: "int" },
        historyType: { type: "byte" },
        isTextCultureInvariant: { type: "int" },
        value: { type: "string" }
    } as DataObject
}

export const $arrayProperty: { [key: string]: DataObject } = {
    ByteProperty: {
        value: { type: "byte" }
    },
    EnumProperty: {
        value: { type: "string" }
    },
    StrProperty: {
        value: { type: "string" }
    },
    InterfaceProperty: {
        ...$objectReference
    },
    ObjectProperty: {
        ...$objectReference
    },
    IntProperty: {
        value: { type: "int" }
    },
    Int64Property: {
        value: { type: "int64" }
    },
    FloatProperty: {
        value: { type: "float" }
    },
    SoftObjectProperty: {
        ...$objectReference,
        number: { type: "int" }
    },
    StructProperty: {
        name: { type: "string" },
        type: { type: "string" }, // StructProperty
        size: { type: "int" },
        padding: { type: "int" }, // 0
        elementType: { type: "string" },
        uuid1: { type: "int" }, // 0
        uuid2: { type: "int" }, // 0
        uuid3: { type: "int" }, // 0
        uuid4: { type: "int" }, // 0
        padding2: { type: "byte" } // 0
        // typed data
    }
}

export const $mapPropertyKey: { [key: string]: DataObject } = {
    ObjectProperty: {
        ...$objectReference
    },
    IntProperty: {
        value: { type: "int" }
    },
    StructProperty: {
        number1: { type: "int" },
        number2: { type: "int" },
        number3: { type: "int" }
    }
}
export const $mapPropertyValue: { [key: string]: DataObject } = {
    ByteProperty: {
        value: { type: "byte" }
    },
    IntProperty: {
        value: { type: "int" }
    },
    Int64Property: {
        value: { type: "int64" }
    },
    StructProperty: {
        properties: { type: "list" }
    }
}

export const $setProperty: { [key: string]: DataObject } = {
    UInt32Property: {
        value: { type: "int" }
    },
    StructProperty: {
        value: { type: "int64" },
        value2: { type: "int64" }
    },
    ObjectProperty: {
        ...$objectReference
    }
}
