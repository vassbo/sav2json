# Satisfactory .sav file to JSON converter

> Parses a Satisfactory 1.0 Save Binary File into a more readable JSON format

Works in nodejs and in the browser!

## Example node

```js
import parseFile from "sav2json"

const json = await parseFile(FILE_PATH_OR_BUFFER)
// further process the json...
```

By default the output will be trimmed of unnecessary parts, but you can pass `{trim: false}` in case you want to disable that.

## Example browser

```js
import parseFile from "sav2json"

// assumes a file input
document.getElementById("savinput").addEventListener("change", readFile)

async function readFile(e) {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = async (e) => {
        const buffer = new Uint8Array(e.target.result)
        const json = await parseFile(buffer)
        // further process the json...
    }
    reader.readAsArrayBuffer(file)
}
```
