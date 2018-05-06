

import * as THREE from 'three'
import { WebGLRenderTarget } from 'three'
import {addRenderTarget } from '../../../../redux/actions/items'

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
            stencilBuffer: false,
        };

        const { scene, camera, renderer } = sceneConfig
        this.buffer = new WebGLRenderTarget( width, height, rtParameters )
        this.buffer.id  = "buffer id"
        /*
            this.clearMask = new ClearMaskPass();
            this.renderMask = new MaskPass( scene, camera );
            var renderMaskInverse = new MaskPass( scene, camera );
            renderMaskInverse.inverse = true;
        */
        const SSAPass = new SSAARenderPass(scene, camera)
        this.effectComposer = new EffectComposer(renderer, this.buffer)
        this.renderPass = new RenderPass(scene, camera, null, 0xFFFFFF, 0)
        this.sepiaPass = new ShaderPass(SepiaShader)
        this.bloomPass = new BloomPass(0.4)
        this.glitchPass = new GlitchPass(0.4)
        
        this.antiAliasPass = new ShaderPass(FXAAShader)
        this.antiAliasPass.uniforms[ 'resolution' ].value.set(1/width, 1 / height);
        this.effectComposer.addPass(this.renderPass)
        if(name === "graphics") {

        }
        
        this.effectComposer.addPass(this.glitchPass)
        this.effectComposer.swapBuffers()
        
        addRenderTarget(this.config)
    }
    setCamera = (camera) => {
        this.renderPass.camera = camera
    }

    render = (renderer, time, amp) => {
        this.glitchPass.amp = amp
        this.effectComposer.render(time)
        
    }
}