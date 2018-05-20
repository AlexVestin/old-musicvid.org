const controlTypes = ["OrbitControl"]
const controlsGroup = {
    title: "Controls",
    items: {
        enabled: {value: false, type: "Boolean"},
        type: {value: 0, type: "List", options: controlTypes},
        maxPolarAngle: {value:  Math.PI * 0.495, type: "Number"},
        panningMode: {type: "List", options: ["1", "0"], tooltip: "0/1 for horizontal/vertical panning"},
        targetX: {value: 0, type: "Number"},
        targetY: {value: 10, type: "Number"},
        targetZ: {value: 0, type: "Number"},
        minDistance: {value: 40.0, type:"Number"},
        maxDistance: {value: 300.0, type:"Number"},   
    }
}

export default {
    config: {
        enabled: false,
        type: "OrbitControl",
        defaultConfig: [controlsGroup],
        panningMode: 1,
        minDistance:  40.0,
        maxDistance: 300.0,
        targetX: 0, 
        targetY: 10, 
        targetZ: 0, 
        maxPolarAngle: Math.PI * 0.495,
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