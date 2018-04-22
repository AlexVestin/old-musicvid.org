const baseConfig = {
    name: {value: "", type: "String", tooltip: "",  editable: true},
    start: {value: 0, type: "Number", tooltip: "Time in millisecond when item will be rendered", editable:  true},
    end: {value: 0, type: "Number", tooltip: "Time in millisecond when item won't be rendered any more", editable:  true},
    id: {value: 0, type: "Number", editable: false},
    type: {value: 0, type: "String", editable: false},
    layer: {value: "Scene", type: "String", tooltip: "", editable: true},
}

const fileConfig = {
    ...baseConfig,
    file: {value: null, type:"Object", editable: false}
}

const movableConfig = {
    ...baseConfig,
    centerX: {value: 0, type: "Number", tooltip: "", editable: true},
    centerY: {value: 0, type: "Number",  tooltip: "", editable: true},
}

const text3DConfig = {
    ...movableConfig,
    text: {value: "Text", typ:"String", tooltip: "", editable: true},
    fontSize: {value: 5, type: "Number",  tooltip: "", editable: true},
    color: {value: "FFFFFF", type: "String",tooltip: "", editable: true},
}

const barsConfig = {
    ...movableConfig,
    
}

export default {
    "BARS": barsConfig, 
    "IMAGE": fileConfig, 
    "SOUND": fileConfig, 
    "TEXT3D": text3DConfig, 
    "WATER": baseConfig 
}

