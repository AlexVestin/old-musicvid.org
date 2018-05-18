

import * as THREE from 'three'
import { WebGLRenderTarget } from 'three'

import EffectComposer from './effectcomposer'
import RenderPass from './passes/renderpass'
import BloomPass from './passes/bloompass'
import SepiaShader from './shaders/sepiashader'
import ShaderPass from './passes/shaderpass';
import MaskPass, { ClearMaskPass } from './passes/maskpass'
import FXAAShader from './shaders/fxaa'
import SSAARenderPass from './passes/ssaapass'

import GlitchPass from './passes/glitchpass'

export default class RenderTarget {
    constructor(name, width, height, sceneConfig, isMain = false) {
        this.config = {}
        this.config.id = Math.floor(Math.random() * 40000000)
        this.config.name = name
        this.config.isMain = isMain

        var rtParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: true,
        };

        const { scene, camera, renderer } = sceneConfig
        this.buffer = new WebGLRenderTarget( width, height, rtParameters )
        this.effectComposer = new EffectComposer(renderer, this.buffer)
        /*
        this.clearMask = new ClearMaskPass();
        this.renderMask = new MaskPass( scene, camera );
        var renderMaskInverse = new MaskPass( scene, camera );
        renderMaskInverse.inverse = true;
        
        const SSAPass = new SSAARenderPass(scene, camera)
        
       
        this.sepiaPass = new ShaderPass("sepia", SepiaShader)
        
        this.glitchPass = new GlitchPass(0.4)
        
        this.antiAliasPass = new ShaderPass("anti alias", FXAAShader)
        this.antiAliasPass.uniforms[ 'resolution' ].value.set(1/width, 1 / height);
        this.effectComposer.addPass(this.renderPass)
        this.effectComposer.addPass(this.antiAliasPass)
        this.effectComposer.addPass(this.glitchPass)
        
        */
        this.renderPass = new RenderPass(scene, camera, null, 0xFFFFFF, 0)
        this.effectComposer.addPass(this.renderPass)
        this.effectComposer.swapBuffers()

        this.nShaderPasses = 0
        this.passes = [ this.renderPass ]
    }

    setCamera = (camera) => {
        this.renderPass.camera = camera
    }

    render = (renderer, time, amp) => {
        this.passes.forEach(e => e.amp = amp)
        
        this.effectComposer.render(time)
        if(this.nShaderPasses % 2 === 1)this.effectComposer.swapBuffers()
    }

    setSize = (width, height) => {
        this.effectComposer.setSize(width, height)
    }

    createEffect = (type) =>  {
        var fx;
        switch(type) {
            case "SEPIA":
                fx = new ShaderPass(SepiaShader, undefined, "sepia")
                break;
            case "GLITCH":
                fx = new GlitchPass(0.4)
                break;
            case "ANTI ALIAS":
                fx = new ShaderPass(FXAAShader, undefined, "anti alias")
                break;
            case "BLOOM":
                fx = new BloomPass(0.5)
                break;
            default:
                console.log("unknown EFFECTS type", type)
                return
        }

        this.nShaderPasses++;

        this.passes.push(fx)
        this.effectComposer.addPass(fx)
        this.effectComposer.swapBuffers()

    }

    removeEffect = (config) =>  {
        this.effectComposer.removePass(config)
        this.nShaderPasses--
        this.effectComposer.swapBuffers()
    }

    editEffect = (config, id) => {
        
        const pass = this.passes.find(e => e.config.id === id)
        if(!pass)
            console.log("[rendertarget.js] failed to find pass")
        
        pass.config = {...pass.config, [config.key]: config.value }
        
    }
}