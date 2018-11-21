// SOURCE: https://github.com/ykob/sketch-threejs/blob/master/src/js/modules/sketch/node_text/NodeText.js



import * as THREE from 'three';
import BaseItem from '../../itemtemplates/item'
import shader1 from "./shaders/nodetext/nodeText.vs"
const shader2 = require("./shaders/nodetext/nodeText.fs")
const shader3 = require("./shaders/nodetext/nodeTextPoints.fs")
const shader4 = require("./shaders/nodetext/nodeTextPoints.vs")
const shader5 = require("./shaders/nodetext/nodeTextWire.fs")

const glslify = require("glslify")

export default class NodeText extends BaseItem {
  constructor(config, fileConfig, sceneConfig) {
    super(config)


    this.durationTransform = 0.8; 
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      timeTransform: {
        type: 'f',
        value: this.durationTransform
      },
      durationTransform: {
        type: 'f',
        value: this.durationTransform
      },
      prevIndex: {
        type: 'f',
        value: 1
      },
      nextIndex: {
        type: 'f',
        value: 0
      },
    };
     
    if(!fileConfig) {
      this.config.defaultConfig.push({
        title: "Settings",
        items: {
            test: {type: "Number", value: 10}
          }
      })
    }else {
      this.config = {...fileConfig}
    }
    
    
    this.isTransform = false;
    this.obj = null;
    this.objWire = null;
    this.objPoints = null;

    this.mesh = new THREE.Group()
    let loader = new THREE.FontLoader()
    loader.load('fonts/optimer_regular.typeface.json', (font) => {
        this.createObj(font)
        this.getConfig()
        this.addItem()
    })    
  }

  createObj(font) {
    // Define Geometry
    const optTextGeometry = {
      font: font,
      size: 300,
      height: 0,
      curveSegments: 1,
    };
    const baseGeometries = [
      new THREE.TextBufferGeometry('HELLO', optTextGeometry),
      new THREE.TextBufferGeometry('WORLD', optTextGeometry),
    ];
    const geometry = new THREE.BufferGeometry();
    let maxCount = 0;

    baseGeometries.map((g, i) => {
      g.center();
      //g.mergeVertices();
      if (g.attributes.position.count > maxCount) {
        maxCount = g.attributes.position.count;
      }
    });
    baseGeometries.map((g, i) => {
      const index = (i > 0) ? i + 1 : '';
      if (g.attributes.position.count < maxCount) {
        const basePosition = g.attributes.position.array;
        const position = [];
        const opacity = [];
        for (var j = 0; j < maxCount * 3; j += 3) {
          if (j < (maxCount * 3 - basePosition.length) / 2) {
            position[j] = (Math.random() * 2 - 1) * 700;
            position[j + 1] = (Math.random() * 2 - 1) * 250;
            position[j + 2] = (Math.random() * 2 - 1) * 250;
            opacity[j / 3] = 0;
          } else if (j >= basePosition.length + (maxCount * 3 - basePosition.length) / 2) {
            position[j] = (Math.random() * 2 - 1) * 700;
            position[j + 1] = (Math.random() * 2 - 1) * 250;
            position[j + 2] = (Math.random() * 2 - 1) * 250;
            opacity[j / 3] = 0;
          } else {
            const k = j - (maxCount * 3 - basePosition.length) / 2;
            position[j] = g.attributes.position.array[k];
            position[j + 1] = g.attributes.position.array[k + 1];
            position[j + 2] = g.attributes.position.array[k + 2];
            opacity[j / 3] = 1;
          }
        }
        geometry.addAttribute(`position${index}`, new THREE.Float32BufferAttribute(position, 3, 1));
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
      } else {
        const opacity = [];
        for (var j = 0; j < maxCount ; j++) {
          opacity[j] = 1;
        }
        geometry.addAttribute(`position${index}`, g.attributes.position);
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
        geometry.addAttribute('normal', g.attributes.normal);
        geometry.addAttribute(`uv`, g.attributes.uv);
        geometry.setIndex(g.index);
      }
    });


    alert(glslify(shader2))

    // Define Material
    const material = new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify(shader1),
        fragmentShader: glslify(shader2),
        depthWrite: false,
        transparent: true,
        flatShading: true,
      });
      const materialWire = new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify(shader3),
        fragmentShader: glslify(shader4),
        depthWrite: false,
        transparent: true,
        wireframe: true,
      });
      const materialPoints = new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify(shader5),
        fragmentShader: glslify(shader4),
        depthWrite: false,
        transparent: true,
      });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.objWire = new THREE.Mesh(geometry, materialWire);
    this.objPoints = new THREE.Points(geometry, materialPoints);

    this.mesh.add(this.obj)
    this.mesh.add(this.objWire)
    this.mesh.add(this.objPoints)
  }
  transform() {
    const max = 1;
    this.isTransform = true;
    this.uniforms.timeTransform.value = 0;
    this.uniforms.prevIndex.value = (this.uniforms.prevIndex.value < max) ? this.uniforms.prevIndex.value + 1 : 0;
    this.uniforms.nextIndex.value = (this.uniforms.nextIndex.value < max) ? this.uniforms.nextIndex.value + 1 : 0;
  }
  _animate = (time, audioData) => {
    this.uniforms.time.value = time;
    if (this.isTransform) {
      this.uniforms.timeTransform.value =  Math.min(Math.max(this.uniforms.timeTransform.value + time, 0), this.durationTransform);
    }
    if (this.uniforms.timeTransform.value === this.durationTransform) {
      this.isTransform = false;
    }
  }
}