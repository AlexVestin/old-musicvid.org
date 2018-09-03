import BaseItem from '../../itemtemplates/item'



export default class SimpleText extends BaseItem {

    constructor(config) {
        super(config)   

        this.config.defaultConfig.push({
            title: "Image settings",
            items: {
                x: {type: "Number", value: 0},
                y: {type: "Number", value: 0},
                width: {type: "Number", value: 1},
                height: {type: "Number", value: 1},
                aspectRatio: {type: "Number", value: 0}
            }
        })

        this.ctx = config.ctx
        this.canvas = config.canvas
        this.img = new Image();
        this.img.src = URL.createObjectURL(config.file);
        this.img.onload = () =>  {
            this.loaded = true
            this.config.aspectRatio = this.img.width / this.img.height;
            this.addItem();
        }
        this.getConfig()
        
    }


    animate = (time, audioData) => {
        const { width, height } = this.canvas
        if(this.loaded)
            this.ctx.drawImage(this.img, this.config.x * width, this.config.y * height, this.config.width * width, this.config.height * height)
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}