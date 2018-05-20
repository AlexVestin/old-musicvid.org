

const cameraTypes = ["OrthographicCamera", "PerspectiveCamera"]



const orthoConfig = {type: 0, near: 0, far: 1, left: -1, bottom: -1, top: 1, right: 1, id: Math.floor(Math.random() * 10000000)}
const defaultConfig = [
    {
        title: "Camera",
        hide: false,
        items: {
            type: {value: 0, type: "List", options: cameraTypes},
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


const perspectiveConfig = {type: 0, near: 0, far: 1, x: 0, y: 0, z: 0, pointAtX: 0, pointAtY: 0, pointAtZ: 0, id: Math.floor(Math.random() * 10000000)}
const pDefaultConfig = [
    {
        title: "config",
        hide: false,
        items: {
            type: {value: 0, type: "List", options: cameraTypes},
            near: {value: 0, type: "Number"},
            far: {value: 0, type: "Number"},
            x: {value: 0, type: "Number"},
            y: {value: 0, type: "Number"},
            z: {value: 0, type: "Number"},
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


/*
    const { camera, renderer } = this
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.panningMode = 1;
    controls.minDistance = 40.0;
    controls.maxDistance = 300.0;
    camera.lookAt(controls.target);
    this.controls = controls
*/
