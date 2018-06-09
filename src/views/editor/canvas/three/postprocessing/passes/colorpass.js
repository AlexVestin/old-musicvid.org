import ShaderPass from "./shaderpass";

export default class ColorPass extends ShaderPass {


    update = (time, frequencyBins) => {
        let avg = 0.0
        for(var i = 0; i < 4; i++) {
            avg += frequencyBins[i]
        }
        avg = avg / (4 * 128) || 1 

        this.uniforms.amount.value = avg
    }

}