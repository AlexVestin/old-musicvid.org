import AudioImpactItem from '../../itemtemplates/audioimpactitem'
// CREDIT: http://cssdeck.com/labs/zeaklousedit

class SpaceShip {
    constructor() {
        this.x = 200;
        this.y = 100;
        this.radius = 10;
        this.wing_count = 3;
        this.steps = Math.PI * 2 / this.wing_count;
        this.color = 'hsl(0,100%,50%)';	
        this.hue = 0; 
        this.hue_target = (Math.random() * 360) >> 0;
        this.angle = 0;	
        this.rotation_speed = 0.03;	

        this.glow = false
    }


    draw = (ctx, config, amp) => {	
        if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

        this.hue += (this.hue_target - this.hue) * 0.05;
        this.color = 'hsl(' + this.hue + ', 100%, 50%)';	
        ctx.strokeStyle = this.color;	
        
        if(config.glow ===  true) {
            ctx.shadowColor = '#' +  config.shadowColor;
            ctx.shadowBlur = config.shadowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.lineWidth = config.thickness;
        ctx.save();	
        ctx.translate(this.x, this.y);

        this.angle += this.rotation_speed;
        ctx.rotate(this.angle);
        for (var i = 0; i < this.wing_count; i++) {
            ctx.beginPath();
            let radius = this.radius + config.radius + amp - 60
            if(radius<1)radius = 1
            ctx.arc(0, 0, radius, i * this.steps, i * this.steps + this.steps / 2, false);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    };
    
}

var Circle = function(W, H) {
    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(W / 2, H / 2, 20, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    };
};

export default class CircleRings extends AudioImpactItem {
    constructor(config, fileConfig) {
        super(config)

        if(!fileConfig) {
            this.config.defaultConfig.push({
                title: "Settings",
                items: {
                    type: {type: "List", options: [ 'random', 'unify', 'reverse', 'vary', 'compact' ]},
                    ringCount: {type: "Number", value: 10},
                    thickness: {type: "Number", value: 3},
                    radius: {type: "Number", value: 20},
                }
            })
    
            this.config.defaultConfig.push({
                title: "Glow",
                items: {
                    glow: {type: "Boolean", value: true},
                    shadowColor: {type: "String", value: "FFFFFF"},
                    shadowBlur: {type: "Number", value: 20},
                }
            })

            const attribution = { 
                title: "Author Information", 
                items: {
                    website: {value: "http://cssdeck.com/labs/zeaklousedit", type: "Link", disabled: false},
                    note: {value: "This has been edited and might not represent the original work", type: "Text"}
                }
            }
            this.config.defaultConfig.unshift(attribution)

            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
      
        
        this.width = config.canvas.width
        this.height = config.canvas.height
        this.canvas = config.canvas
        this.ctx = config.ctx

        this.innerCircle = new Circle(this.width, this.height);
        this.ships = [];
        this.createShips()
      
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height


        this.updateShips()

    }

    _updateConfig = (config) => {
        this.config = config 
        this.updateShips()
    }

    updateShips = () => {
        this.ships.forEach((ship, i) => {
            ship.x = this.width / 2;
            ship.y = this.height / 2;
            ship.radius = 20 * (i + 2);

            if(this.config.type === "reverse")	{
                if(i % 2 === 1)
                    ship.rotation_speed = -.03;//WARNING: Keep any rotation speeds really low or a head ache might ensue
            } else if(this.config.type === "vary") {
                if(i % 2 === 0)
                    ship.rotation_speed = .04;
                if(i % 3 === 0)
                    ship.rotation_speed = .02;
            }
            else if(this.config.type === "random") {
                ship.rotation_speed = Math.random() * .05 - .025;
            }
            else if(this.config.type === "compact")	{
                ship.radius = 5 * (i + 2);
                ship.lineWidth = 5;
                ship.wing_count = 100;
                ship.steps = Math.PI * 2 / ship.wing_count;
            }
        })
    }
            
    createShips = ()  =>  {
        this.ships = []
        for(var i = 0; i< this.config.ringCount; i++) 
            this.ships.push(new SpaceShip())
        
        this.updateShips()
    }

    animate = (time, frequencyBins) => {
        //this.innerCircle.draw(this.ctx, true);
        
        let sum  = this.getImpactAmplitude(frequencyBins.bins)
        this.ships.forEach(ship => ship.draw(this.ctx, this.config, sum));
    }
}