import { addEffect } from '../../../../../redux/actions/items'
export default class Pass {
    constructor(name) {
        
        this.enabled = true;
        this.needsSwap = true;
        this.clear = false;
        this.renderToScreen = false;

        this.config = {}
        this.config.defaultConfig = {
            name: {value: "", type: "String", editable: true, tooltip: ""},
            strength: {value: 0, type: "Number", editable: true, toolip: ""}
        }
        
        this.config.strength = 0
        this.config.name = name
        this.config.id = Math.floor(Math.random() * 10000000)
        this.addEffect = addEffect
    }
 
    setSize(width, height) { }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        console.error('THREE.Pass: .render() must be implemented in derived pass.');
    }
};

