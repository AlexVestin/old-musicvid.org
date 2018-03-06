import * as THREE from 'three'
import Iris from './visualizers/Iris'

export default class View {
    constructor(width, height, renderer) {
        this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
        this.camera.position.y = 150;
        this.camera.position.z = 500;
        this.scene = new THREE.Scene();

        this.Iris = new Iris(this.scene, this)
    }
    usePerspectiveCamera = () => {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );
        this.camera.position.y = 150;
        this.camera.position.z = 500;
    }
    useOrthographicCamera = () => {
        this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
        this.camera.position.y = 150;
        this.camera.position.z = 500;
    }

    animate = () => {
        this.Iris.render();
    }
}