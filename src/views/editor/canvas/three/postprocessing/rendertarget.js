

import { WebGLRenderTarget, LinearFilter, RGBAFormat, Vector3 } from 'three'

import EffectComposer from './effectcomposer'
import BloomPass from './passes/bloompass'
import SepiaShader from './shaders/sepiashader'
import ShaderPass from './passes/shaderpass';
import ColorShader from './shaders/colorshader'
import ColorPass from './passes/colorpass'
import CopyShader from './shaders/copyshader'
import SSAAPass from './passes/ssaapass'

import GlitchPass from './passes/glitchpass'
import HalftonePass from './passes/halftonepass';

import TestShader from './shaders/testshader'

export default class RenderTarget {
    constructor(width, height, sceneConfig, isMain = false) {
        this.config = {}
        this.config.id = Math.floor(Math.random() * 40000000)
        this.config.name = "Effects"
        this.config.isMain = isMain

        this.width = width
        this.height = height
        
        var rtParameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
            stencilBuffer: true,
        };
        const { scene, camera, renderer } = sceneConfig
        this.buffer = new WebGLRenderTarget( width, height,  rtParameters )
        this.effectComposer = new EffectComposer(renderer, this.buffer)
        
        this.renderPass = new SSAAPass( {name: "SSAA", scene, camera} );
        const copyPass = new ShaderPass( CopyShader, undefined, "COPY" );
        //const fx =  new GlitchPass(64, undefined, "sepia")

        this.effectComposer.addPass( this.renderPass )
        this.effectComposer.addPass( copyPass );
        copyPass.renderToScreen = true
        copyPass.renderPass = true
        this.renderPass.renderPass = true

        this.passes = [ this.renderPass, copyPass ]
    }

    setCamera = (camera) => {
        this.renderPass.camera = camera
    }

    update = (time, frequencyBins) => {
        this.passes.forEach( e => e.update(time, frequencyBins) )
    }

    render = () => {
        this.effectComposer.render()
    }

    setSize = (width, height) => {
        this.effectComposer.setSize(width, height)
    }

    createEffect = (type) =>  {
        var fx;
        switch(type) {
            case "TEST SHADER":
                fx = new ShaderPass(TestShader, undefined, "ytes")
                const [r,g,b] = [Math.random(), Math.random(), Math.random()]
                fx.material.uniforms.targetColor.value = new Vector3(r, g, b)
                break;
            case "COLOR SHADER":
                fx = new ColorPass(ColorShader, undefined, "color")
                break;
            case "SEPIA":
                fx = new ShaderPass(SepiaShader, undefined, "sepia")
                break;
            case "GLITCH":
                fx = new GlitchPass(64)
                break;
            case "BLOOM":
                fx = new BloomPass(0.5)
                break;
            case "RGB HALFTONE":
                fx = new HalftonePass(this.width, this.height, "halftone")
                break;
            default:
                console.log("unknown EFFECTS type", type)
                return
        }
        fx.renderToScreen = true
        this.passes[this.passes.length - 1].renderToScreen = false
        this.passes.push(fx)
        this.effectComposer.addPass(fx)
    }

    removeEffect = (config) =>  {
        this.effectComposer.removePass(config)
        this.passes[this.passes.length - 1].renderToScreen = true
    }

    editEffect = (config, id) => {
        
        const pass = this.passes.find(e => e.config.id === id)
        if(!pass)
            alert("[rendertarget.js] failed to find pass")

        pass.edit(config.key, config.value)
    }
}