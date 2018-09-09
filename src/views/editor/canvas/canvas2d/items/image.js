import BaseItem from '../../itemtemplates/item'



export default class Imagh extends BaseItem {

    constructor(config) {
        super(config)   

        this.config.defaultConfig.push({
            title: "Image settings",
            items: {
                x: {type: "Number", value: 0},
                y: {type: "Number", value: 0},
                width: {type: "Number", value: 1},
                height: {type: "Number", value: 1},
                aspectRatio: {type: "Number", value: 0},
                mirrorHorizontal: {type: "Boolean", value: false},
                mirrorVertical: {type: "Boolean", value: false},
            }
        })

        this.ctx = config.ctx
        this.canvas = config.canvas
        this.img = new Image();
        this.img.src = URL.createObjectURL(config.file);
        this.img.onload = () =>  {
            this.loaded = true
            this.config.aspectRatio = this.img.width / this.img.height;
            this.config.localFile = true;
            this.addItem();
        }

        
        this.getConfig()
        
        
    }

    mirrorImage = (ctx, image, x1 = 0, y1 = 0, x2, y2, horizontal = false, vertical = false) => {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x1 + horizontal ? image.width : 0, // set the x origin
            y1 + vertical ? image.height : 0   // set the y origin
        );
        ctx.drawImage(image,x1,y1, x2, y2);
        ctx.restore(); // restore the state as it was when this function was called
    }

    animate = (time, audioData) => {
        const { width, height } = this.canvas

        
        if(this.loaded) {
            const x1 = this.config.x * width;
            const x2 =  this.config.width * width;
            const y1 = this.config.y * height;
            const y2 = this.config.height * height;

            this.mirrorImage(this.ctx, this.img, x1, y1, x2, y2, this.config.mirrorHorizontal, this.config.mirrorVertical)
        }
            
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}