//////////////////////////////////////////////////////////////////////////////////
// CREDIT https://github.com/raphamorim/canvas-experiments
//////////////////////////////////////////////////////////////////////////////////

import BaseItem from '../../three/items/item'

class Trail {
    constructor(pos, t, plan_i) {
        this.TRAIL_PLAN = ["u","r","d","b","r","c"];

        this.colors = {
            lineRed: 255,
            lineGreen: 255,
            lineBlue: 255,
            strokeRed: 255,
            strokeBlue: 255,
            strokeGreen: 255,
            strokeAlpha: 1
        }

        this.pos={x:0, y:0, z:0};
        this.start={x:0, y:0, z:0};
        this.goal={x:0, y:0, z:0};

        this.vertexes = [];
        pointCopy(pos, this.pos);
        pointCopy(pos, this.start);
        pointCopy(pos, this.goal);
        this.plan_i = plan_i % this.TRAIL_PLAN.length || 0;
        this.sz = pos.z;
        this.setNextGoal(t);
    }

    update = function(t){
        quadIn(
            t-this.start_time,
            this.start,
            this.goal,
            this.take_time,
            this.pos
        );
        if(t-this.start_time > this.take_time){
            this.setNextGoal(this.start_time+this.take_time);
            this.update(t);
        }
    };

    setNextGoal = (t) => {
        pointCopy(this.goal, this.start);
        this.plan_i = (this.plan_i+1)%this.TRAIL_PLAN.length;
        switch(this.TRAIL_PLAN[this.plan_i]){
            case "r":
                this.goal.x += Math.random()*50+50;
                break;
            case "u":
                this.goal.y -= Math.random()*250+100;
                break;
            case "d":
                this.goal.y = 0;
                break;
            case "b":
                this.goal.z += Math.random()*1;
                break;
            case "c":
                this.goal.z = this.sz;
                break;
            default:
                break;
        }
        this.start_time = t;
        this.take_time = 100+Math.random()*100;
        this.vertexes.push(pointCopy(this.start, {x:0,y:0,z:0}));
        if(this.vertexes.length > 100){
            this.vertexes.splice(0,this.vertexes.length-100);
        }
    };


    draw = (ctx, camera) => {
        var i;
        var ps = {x:0, y:0};
        ctx.beginPath();
        if(perspective(this.vertexes[0], camera, ps)){
            ctx.moveTo(ps.x, ps.y);
        }
        var x0 = ps.x;
        for(i=1; i<this.vertexes.length; i++){
            if(perspective(this.vertexes[i], camera, ps)){
                const {strokeRed, strokeGreen, strokeBlue, strokeAlpha } = this.colors
                const alpha = 2 /(this.pos.z-camera.z)
                ctx.strokeStyle = `rgba(${strokeRed},${strokeBlue},${strokeGreen},${alpha * strokeAlpha})`
                //ctx.strokeStyle = "rgba(255,2,255,"+2/(this.vertexes[i].z-camera.z)+")";

                ctx.lineTo(ps.x, ps.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(ps.x, ps.y);
            }
        }
        if(perspective(this.pos, camera, ps)){
            const {strokeRed, strokeGreen, strokeBlue,strokeAlpha } = this.colors
            const alpha = 2 /(this.pos.z-camera.z)
            ctx.strokeStyle = `rgba(${strokeRed},${strokeBlue},${strokeGreen},${alpha * strokeAlpha})`
            ctx.lineTo(ps.x, ps.y);
            ctx.stroke();
        }
    };
}


export default class InceptionCity extends BaseItem {
    constructor(config) {
        super(config) 
        this.canvas = config.canvas;
        this.ctx = config.ctx;
        this.trails = [];
        this.time_pre = 0;

        for(var i=0; i<8; i++){
            this.trails.push(new Trail({x:Math.random()*50-25, y:Math.random()*50-25, z:i}, 0, i));
        }
        this.camera = {x: 0, y: 0, z:-2};
        

        this.config.defaultConfig.push({
            title: "Settings",
            items: {
                x: {type: "Number", value: 0},
                y: {type: "Number", value: 0},
                lineRed: {type: "Number", value: 255},
                lineGreen: {type: "Number", value: 255},
                lineBlue: {type: "Number", value: 255},
                strokeRed: {type: "Number", value: 255},
                strokeGreen: {type: "Number", value: 255},
                strokeBlue: {type: "Number", value: 255},
                strokeAlpha: {type: "Number", value: 1}
            }
        })

        this.getConfig()
        this.addItem()
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }

    _updateConfig = (config) => {
        const { lineRed, lineGreen, lineBlue, strokeRed, strokeGreen, strokeBlue, strokeAlpha } = config
        this.trails.forEach(t => t.colors = { lineRed, lineGreen, lineBlue, strokeRed, strokeGreen, strokeBlue, strokeAlpha })
    }

    updateScene =  (time_now) => {
        var time_d = ((time_now - this.time_pre) * 1000) >> 0;
        this.trails.forEach(t => t.update(time_now * 1000))
        this.camera.x += (this.trails[0].pos.x - this.camera.x - 50) * 0.0002 * time_d;
        this.camera.y += (this.trails[0].pos.y - this.camera.y - 300) * 0.00002 * time_d;
        this.time_pre = time_now;
    };

    drawScene = function(){
        //this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
        this.trails.forEach(t => t.draw(this.ctx, this.camera))
    };
    

    animate = (newTime, frequencyBins) => {
        this.ctx.translate(this.canvas.width/2, this.canvas.height/2); 
        this.updateScene(newTime)
        this.drawScene()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function pointCopy(src, dst){
    dst.x = src.x;
    dst.y = src.y;
    dst.z = src.z;
    return dst;
};

function quadIn(t, b, c, d, dst){
    t /= d;
    dst.x = (c.x-b.x)*t*t+b.x;
    dst.y = (c.y-b.y)*t*t+b.y;
    dst.z = (c.z-b.z)*t*t+b.z;
};

function perspective(point, camera, dst){
    var dz = point.z - camera.z;
    if(dz > 0){
        dst.x = (point.x-camera.x)/dz;
        dst.y = (point.y-camera.y)/dz;
        return true;
    }
    return false;
};