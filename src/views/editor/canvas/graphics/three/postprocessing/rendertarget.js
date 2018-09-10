

import { WebGLRenderTarget, LinearFilter, RGBAFormat } from 'three'

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

import PixelPass from './passes/pixelpass'

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
        
        this.renderPass = new SSAAPass( {name: "SSAA", scene, camera, renderPass: true} );
        const copyPass = new ShaderPass( CopyShader, {name: "Copypass", shouldAdd: false, type: "COPY"} );
        //const fx =  new GlitchPass(64, undefined, "sepia")

        this.effectComposer.addPass( this.renderPass )
        this.effectComposer.addPass( copyPass );
        copyPass.renderToScreen = true
        copyPass.renderPass = true
        this.renderPass.renderPass = true

        this.passes = [ ]
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

    addFromFile = (pass) => {
        console.log(pass)
        this.createEffect(pass.type, pass)
    }
    createEffect = (type, fileConfig) =>  {

        console.log("???", type)
        var fx;
        switch(type) {
            case "PIXEL":
                fx = new PixelPass({type, width: this.width, height: this.height, name: "Pixelpass"}, fileConfig);
            break;
            case "COLOR SHADER":
                fx = new ColorPass(ColorShader, {name: "color", type}, fileConfig)
                break;
            case "SEPIA":
                fx = new ShaderPass(SepiaShader, {name: "sepia", type}, fileConfig)
                break;
            case "GLITCH":
                fx = new GlitchPass({type, name: "Glitch"}, 64, fileConfig)
                break;
            case "BLOOM":
                fx = new BloomPass({type, name: "Bloom"}, 0.5, fileConfig)
                break;
            case "RGB HALFTONE":
                fx = new HalftonePass({width: this.width, height: this.height, name: "halftone"}, fileConfig)
                break;
            default:
                console.log("unknown EFFECTS type", type)
                return
        }
        fx.renderToScreen = true
        this.effectComposer.passes[this.effectComposer.passes.length - 1].renderToScreen = false
        this.passes.push(fx)
        this.effectComposer.addPass(fx)
    }

    removeEffect = (config) =>  {
        this.effectComposer.removePass(config)
        this.effectComposer.passes[this.effectComposer.passes.length - 1].renderToScreen = true
    }

    editEffect = (config, id) => {
        
        const pass = this.passes.find(e => e.config.id === id)
        if(!pass)
            alert("[rendertarget.js] failed to find pass")

        pass.edit(config.key, config.value)
    }
}