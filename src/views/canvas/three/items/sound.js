

export function getSoundConfigs() {
    return {
        name: {value: "Unnamed", type: "String", tooltip: "", input: true},
        path: {value: "Unnamed", type: "String", tooltip: "", input: true},
        file: { value: null, type: "Object", input: false},
        //Mandatory
        type: {value: "BARS", type: "String", tooltip: "", input: true},
        id: {value: 0, type: "Number", tooltip: "", input: true}
    }
}