

const cameraTypes = ["OrthographicCamera", "PerspectiveCamera"]



const orthoConfig = {type: "OrthographicCamera", near: 0, far: 1, left: -1, bottom: -1, top: 1, right: 1, id: Math.floor(Math.random() * 10000000)}
const defaultConfig = [
    {
        title: "Camera",
        hide: false,
        items: {
            type: {value: 0, type: "List", options: cameraTypes , defaultIndex: 1},
            near: {value: 0, type: "Number"},
            far: {value: 0, type: "Number"},
            left: {value: 0, type: "Number"},
            right: {value: 0, type: "Number"},
            top: {value: 0, type: "Number"},
            bottom: {value: 0, type: "Number"},
        }
    }
]

orthoConfig.defaultConfig = defaultConfig


const perspectiveConfig = {type: "PerspectiveCamera", fov: 45, aspect: 720/480, near: 0, far: 10000, x: 30, y: 30, z: 200, pointAtX: 0, pointAtY: 0, pointAtZ: 0, id: Math.floor(Math.random() * 10000000)}
const pDefaultConfig = [
    {
        title: "Camera",
        hide: false,
        items: {
            type: {value: 0, type: "List", options: cameraTypes, defaultIndex:  0},
            near: {value: 0, type: "Number"},
            far: {value: 0, type: "Number"},
            fov: {value: 45, type: "Number"},
            aspect: {value: 720/480, type: "Number"},
            x: {value: 30, type: "Number"},
            y: {value: 30, type: "Number"},
            z: {value: 200, type: "Number"},
            pointAtX: {value: 0, type: "Number"},
            pointAtY: {value: 0, type: "Number"},
            pointAtZ: {value: 0, type: "Number"},
        }
    }
]

perspectiveConfig.defaultConfig = pDefaultConfig



export default {
    perspectiveConfig,
    orthoConfig
}



