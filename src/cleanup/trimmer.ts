const deleteKeys = ["always", "unknown", "size", "index", "padding", "saveversion", "count", "version", "uuid", "headertype"]
const booleanKey = /^(has[A-Z]|is[A-Z]|was[A-Z]|flag).*/

export function trimJSON(json: any) {
    if (json.mapOptions) json.mapOptions = json.mapOptions.split("?").filter(Boolean)
    if (json.modMetadata) json.modMetadata = JSON.parse(json.modMetadata)
    if (json.saveFileBody) {
        delete json.saveFileBody.levelGroupingGrids
        delete json.saveFileBody.objectReferences
    }

    json = processJSON(json)

    json.saveFileBody.levels = json.saveFileBody.levels.filter((level: any) => {
        delete level.sublevelName
        return Object.values(level).flat().length
    })

    return json
}

function processJSON(json: any) {
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (booleanKey.test(key)) {
                if (json[key] === 0) json[key] = false
                else if (json[key] === 1) json[key] = true
            } else if (key === "trailing" && !json[key]) {
                delete json[key]
            } else if (key === "properties" && !json[key].length) {
                delete json[key]
            } else if (deleteKeys.find((a) => key.toLowerCase().includes(a))) {
                delete json[key]
            }

            // recursively process if the value is an object
            if (typeof json[key] === "object") {
                processJSON(json[key])
            }
        }
    }

    return json
}
