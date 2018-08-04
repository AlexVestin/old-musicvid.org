//////////////////////////////////////////////////////////////////////////////////
// A demonstration of a Canvas nebula effect
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it
//////////////////////////////////////////////////////////////////////////////////

import BaseItem from '../../three/items/item'


class Puff {
    constructor(p, ctx, canvas, w, h) {
        var	opacity, sy = ( Math.random()*285 ) >> 0, sx = (Math.random()*285)>>0;
        this.p = p;
        
        this.move = function(timeFac) {	            
            let p = this.p + 0.3 * timeFac;				
            opacity = ( Math.sin ( p * 0.05 )*0.5);						
            
            if(opacity < 0) {
                p = opacity = 0;
                sy = (Math.random()*285)>>0;
                sx = (Math.random()*285)>>0;
            }												
            this.p = p;																			
            
            ctx.globalAlpha = opacity;
            ctx.drawImage(canvas, sy+p, sy+p, 285-(p*2), 285-(p*2), 0, 0, w, h);	
        };
    }
}



export default class Nebula extends BaseItem {
    constructor(config) {
        super(config)

        this.config.defaultConfig.push( {
            title: "Configs",
            items: {
                speed: {type: "Number", value: 100 },
                x: {type: "Number", value: 0 },
                y: {type: "Number", value: 0 },
                width: {type: "Number", value: 720 },
                height: {type: "Number", value: 480 }
            }
        })

        this.getConfig()

        this.canvas = document.createElement('canvas');	
        this.canvas2 = config.canvas
        this.canvas3 = document.createElement('canvas');	
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx2 = config.ctx
        this.ctx3 = this.canvas3.getContext('2d');

        this.width = this.canvas3.width = config.canvas.width
        this.height = this.canvas3.height = config.canvas.height
        this.canvas.width = this.width / 2
        this.canvas.height = this.height / 2
        
        var	img = new Image();
        this.oldTime = 0	
        
        this.puffs = [];			
        this.puffs.push( new Puff(0, this.ctx, this.canvas3, this.canvas.width, this.canvas.height) );
        this.puffs.push( new Puff(20, this.ctx, this.canvas3, this.canvas.width, this.canvas.height) );
        this.puffs.push( new Puff(40, this.ctx, this.canvas3, this.canvas.width, this.canvas.height) );
        
        // Turns out Chrome is much faster doing bitmap work if the bitmap is in an existing canvas rather
        // than an IMG, VIDEO etc. So draw the big nebula image into canvas3
        /*
        var	$canvas3 = $('#canvas3');
        var	ctx3 = $canvas3[0].getContext('2d');
        $(img).bind('load', null, () => {  ctx3.drawImage(img, 0,0, 570, 570);	loop(); });
        */
        img.src = '/img/nebula.jpg';
        img.onload = () => { 
            this.ctx3.drawImage(img, 0,0, config.canvas.width, config.canvas.height); 
            this.addItem();
        }
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }

    animate = (newTime, frequencyBins) => {
        var	sortPuff = function(p1,p2) { return p1.p - p2.p; };	        
        if(this.oldTime === 0 ) {
            this.oldTime = newTime;
        }

        let timeFac = ( newTime - this.oldTime ) * this.config.speed;
        if(timeFac > 3) { timeFac = 3;}
        this.oldTime = newTime;						
        
        this.puffs.sort(sortPuff);							
        this.puffs.forEach( p => p.move(timeFac) )
        this.ctx2.drawImage(this.canvas, 0, 0, this.width, this.height);				
    }

}


