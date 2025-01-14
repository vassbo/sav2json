import type { DataObject } from "./DataTypes"

export const $saveFileHeader: DataObject = {
    saveHeaderVersion: { type: "int" },
    saveVersion: { type: "int" },
    buildVersion: { type: "int" },
    mapName: { type: "string" },
    mapOptions: { type: "string" },
    sessionName: { type: "string" },
    playedSeconds: { type: "int" },
    saveTimestamp: { type: "int64" },
    sessionVisibility: { type: "byte" },
    editorObjectVersion: { type: "int" },
    modMetadata: { type: "string" },
    modFlags: { type: "int" },
    saveIdentifier: { type: "string" },
    isPartitionedWorld: { type: "int" },
    saveDataHash: { type: "md5" },
    isCheatsEnabled: { type: "int" }
    // body
}

export const $compressedSaveFileBody: DataObject = {
    unrealEnginePackageSignature: { type: "hex" },
    archiveHeader: { type: "hex" },
    maximumChunkSize: { type: "int64" },
    compressionAlgorithm: { type: "byte" },
    compressedSize: { type: "int64" },
    uncompressedSize: { type: "int64" },
    compressedSizeRepeat: { type: "int64" },
    uncompressedSizeRepeat: { type: "int64" }
    // compressed bytes of the chunk
}

export const $saveFileBody: DataObject = {
    uncompressedSize: { type: "int" },
    alwaysZero: { type: "int" },
    alwaysSix: { type: "int" },
    alwaysNone: { type: "string" },
    alwaysZero2: { type: "int" },
    unknownInt: { type: "int" },
    alwaysOne: { type: "int" },
    alwaysNone2: { type: "string" },
    unknownInt2: { type: "int" },
    levelGroupingGrids: { type: "list" },
    sublevelCount: { type: "int" },
    levels: { type: "list" },
    objectReferencesCount: { type: "int" },
    objectReferences: { type: "list" }
}
