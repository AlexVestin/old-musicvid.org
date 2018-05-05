

import * as THREE from 'three'

export default class RenderTarget {
    constructor(name, width, height) {
        this.config = {}
        this.config.id = Math.floor(Math.random() * 40000000)
        this.config.name = name

        this.buffer = new THREE.WebGLRenderTarget(width, height)
    }
}