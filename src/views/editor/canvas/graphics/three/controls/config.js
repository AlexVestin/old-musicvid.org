const controlTypes = ["OrbitControl", "TrackballControl"]
const orbitGroup = {
    title: "Controls",
    items: {
        controlsEnabled: {value: true, type: "Boolean"},
        autoRotate: {type: "Boolean", value: false},
        autoRotateSpeedLeft: {type: "Number", value: 2.0},
        autoRotateSpeedUp: {type: "Number", value: 2.0},
        type: {value: 0, type: "List", options: controlTypes},
        maxPolarAngle: {value:  Math.PI * 0.495, type: "Number"},
        panningMode: {type: "List", options: ["1", "0"], tooltip: "0/1 for horizontal/vertical panning"},
        rotateSpeed: {type: "Number", value: 1.0},
        targetX: {value: 0, type: "Number"},
        targetY: {value: 0, type: "Number"},
        targetZ: {value: 0, type: "Number"},
        minDistance: {value: 40.0, type:"Number"},
        maxDistance: {value: 300.0, type:"Number"},   
    }
}

const trackballGroup = {
    title: "Controls",
    items: {
        controlsEnabled: {value: false, type: "Boolean"},
        type: {value: 0, type: "List", options: controlTypes},
        rotateSpeed: {value: 1.0, type: "Number"},
        zoomSpeed: {value: 1.2, type: "Number"},
        panSpeed: {value: 0.8, type: "Number"},
        noZoom:  {value: false, type: "Boolean"},
        noPan: {value: false, type: "Boolean"},
        staticMoving: {value: true, type: "Boolean"},
        dynamicDampingFactor: {value: 0.3, type: "Number"}
    }
}



export default {
    orbitConfig: {
        controlsEnabled: true,
        type: "OrbitControl",
        autoRotate: false,
        autoRotateSpeedUp: 2.0,
        autoRotateSpeedLeft: 2.0,
        defaultConfig: [orbitGroup],
        rotateSpeed: 1,
        panningMode: 1,
        minDistance:  40.0,
        maxDistance: 300.0,
        targetX: 0, 
        targetY: 0, 
        targetZ: 0, 
        maxPolarAngle: Math.PI * 0.495,
    },

    trackballConfig: {
        controlsEnabled: true,
        type: "TrackballControl",
        defaultConfig: [trackballGroup],
        rotateSpeed: 1.0,
        zoomSpeed: 1.2,
        panSpeed: 0.8,
        noZoom: false,
        noPan: false,
        staticMoving: true,
        dynamicDampingFactor: 0.3
    }
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