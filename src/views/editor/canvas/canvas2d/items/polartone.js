// CREDIT: https://github.com/mattdesl/polartone
import BaseItem from '../../three/items/item'
import createCamera from 'perspective-camera'
import lerp from 'lerp'

import { dispatchAction } from '@redux/actions/items'

export default class WaveletCanvas extends BaseItem {
    constructor(config) {
        super(config)
        const shape = [config.canvas.width, config.canvas.height]

        this.time = 0
        this.ctx = config.ctx

        this.internalCanvas = document.createElement("canvas")

        this.internalCanvas.width = 2048
        this.internalCanvas.height = 2048
        this.internalCtx = this.internalCanvas.getContext("2d")

        this.camera = createCamera({
            fov: Math.PI / 4,
            near: 0.01,
            far: 100,
            viewport: [0, 0, ...shape]
        })

        this.duration = 180
        this.positions = []

        this.config.defaultConfig.push({
            title: "Settings",
            items: {
                amplitude: {type: "Number", value: 3},
                capacity: {type: "Number", value: 900},
                distance: {type: "Number", value: 0.25},
                extent: {type: "Number", value: 3},
                x: {type: "Number", value: 0},
                y: {type: "Number", value: 3.5},
                z: {type: "Number", value: 0},
            }
        })

        const colorGroup = {
            title: "Colors",
            items: {
                glow: {type: "Boolean", value: false},
                shiftingGlowColors: {type: "Boolean", value: false},
                shadowColor: {type: "String", value: "FFFFFF"},
                shadowBlur: {type: "Number", value: 20},
                shadowOffsetX: {type: "Number", value: 0},
                shadowOffsetY: {type: "Number", value: 0},
                shiftingColors: {type: "Boolean", value: true},
                shiftSpeed: {type: "Number", value: 0.2},
                shiftingDarkness: {type:"Number", value: 30, tooltip: "Upper bound for shifting color values"},
                red: {type: "Number", value: 225, disabled: true},
                blue: {type: "Number", value: 225, disabled: true},
                green: {type: "Number", value: 225, disabled: true},
                alpha: {type: "Number", value: 0.5},
            }
        }
        this.config.defaultConfig.push(colorGroup)
        this.colorGroupIndex = this.config.defaultConfig.findIndex(e => e.title === colorGroup.title)

        this.cursor = [0, 0, 0] 
        this.dpr = window.devicePixelRatio
        this.getConfig()
        this.addItem()


        this.startRed = (Math.random() * 255) >> 0
        this.startGreen = (Math.random() * 255) >> 0
        this.startBlue = (Math.random() * 255) >> 0
        this.red   = 0
        this.green   = 0
        this.blue   = 0   
        this.glowGreen = 0
        this.glowRed = 0
        this.glowBlue = 0
    }

    stop = () => {
       this.internalCtx.clearRect(0,0,this.internalCanvas.width, this.internalCanvas.height)
       this.time = 0
       this.positions = []
    }

    _updateConfig = (config) => {
        if(config.shiftingColors !== this.config.shiftingColors){
            dispatchAction( {
                type: "TOGGLE_ITEMS_ENABLED", 
                payload: {
                    items: ["red", "blue", "green"], 
                    disabled: config.shiftingColors, 
                    groupIndex: this.colorGroupIndex
                }
            })
        }

        this.config = config
    }


    setSize = (width, height) => {
        this.width = width
        this.height = height
    }


    //const node = Analyser(audio, audiothis.ctx, { audible: true, stereo: false })
    //loop.on('tick', render).start()

    animate = (dt, audioData) => {
        this.time = dt
        const dur = this.time / this.duration
        const bufferLength = audioData.length

        // set up our this.camera
        // with WebGL (persistent lines) could be
        // interesting to fly through it in 3d
        this.camera.identity()
        this.camera.translate([this.config.x, this.config.y, this.config.z])
        this.camera.lookAt([0, 0, 0])
        this.camera.update()

        this.internalCtx.save()
        this.internalCtx.scale(this.dpr, this.dpr)

        // for a motion trail effect
        // const [width, height] = shape
        // this.ctx.fillStyle = 'rgba(255,255,255,0.001)'
        // this.ctx.fillRect(0, 0, width, height)

        let radius = 1 - dur
        const startAngle = this.time
        const alpha = this.config.alpha || 0.25
        
        if(this.config.shiftingColors) {
            const cs =  128 - this.config.shiftingDarkness
            this.red = (cs + Math.sin(this.startRed + (dt * this.config.shiftSpeed)) * cs) >> 0
            this.blue =  (cs + Math.sin(this.startGreen + (dt * this.config.shiftSpeed)) * cs) >> 0
            this.green =  (cs + Math.sin(this.startBlue + (dt * this.config.shiftSpeed)) * cs) >> 0 
            this.internalCtx.strokeStyle = `rgba(${this.red}, ${this.blue}, ${this.green}, ${alpha})`
        }else {
            this.internalCtx.strokeStyle = `rgba(${this.config.red}, ${this.config.blue}, ${this.config.green}, ${alpha})`
        }
       
        if(this.config.glow ===  true) {
            const cs =  128 - this.config.shiftingDarkness
            this.glowRed = (cs + Math.sin(this.startRed + (dt * this.config.shiftSpeed)) * cs) >> 0
            this.glowBlue =  (cs + Math.sin(this.startGreen + (dt * this.config.shiftSpeed)) * cs) >> 0
            this.glowGreen =  (cs + Math.sin(this.startBlue + (dt * this.config.shiftSpeed)) * cs) >> 0 

            this.ctx.shadowColor = `rgb(${this.glowRed}, ${this.glowBlue}, ${this.glowGreen})`
            this.ctx.shadowBlur = this.config.shadowBlur;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        } else {
            this.ctx.shadowBlur = 0;
        }
        
        
        this.internalCtx.lineWidth = 1
        this.internalCtx.lineJoin = 'round'
        this.internalCtx.beginPath()

        
        for (let i = this.positions.length - 1; i >= 0; i--) {
            var pos = this.positions[i]
            this.internalCtx.lineTo(pos[0], pos[1])
        }
        this.internalCtx.stroke()
        this.internalCtx.restore()

        //copy to output canvas
        this.ctx.drawImage(this.internalCanvas, 0, 0)

        for (let i = 0; i < bufferLength; i++) {
            
            const alpha = i / (bufferLength - 1)
            const angle = lerp(startAngle + this.config.distance, startAngle, alpha)
            this.cursor[0] = Math.cos(angle) * radius
            this.cursor[2] = Math.sin(angle) * radius

            const amplitude = (audioData[i] / 128.0) * this.config.amplitude
            const waveY = (amplitude * this.config.extent / 2)

            const adjusted = [this.cursor[0], this.cursor[1] + waveY, this.cursor[2]]
            const [x, y] = this.camera.project(adjusted)

            if (this.positions.length >  this.config.capacity) {
                this.positions.shift()
            }
            
            this.positions.push([x, y])
        }
    }
}


