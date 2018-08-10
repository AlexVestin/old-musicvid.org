import React, { PureComponent } from 'react'
import { setTime } from '@redux/actions/globals'
import Playline from './playline'

import classes from './timeline.css'
const style = {
    backgroundColor: "#222222",
    minHeight: "20px",
    height: "20px",
    width: "100%",
    overflow: "hidden"
}

class Timeline extends PureComponent {

    constructor() {
        super()

        this.numbers = []
        for(var i = 0; i < 100; i++)
            this.numbers.push(i)
    }

    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    onClick = (evt) => {
        const { left, zoomWidth, unitSize } = this.props
        const [x, ] = this.getRelativeCoordinates(evt)

        const t = x/(zoomWidth * unitSize) + left / (zoomWidth * unitSize)
        setTime(t)

        console.log("setting time to: ", t)
    }

    convertTime = (sec) => {
        var min = Math.floor(sec/60);
        (min >= 1) ? sec = sec - (min*60) : min = '00';
        (sec < 1) ? sec='00' : void 0;
        (min.toString().length === 1) ? min = '0'+min : void 0;    
        (sec.toString().length === 1) ? sec = '0'+sec : void 0;    
        return min+':'+sec;
    }

    render() {
        const { maxNrUnits, zoomWidth, unitSize, left } = this.props


        let numbers = []
        const nNrs = 20
        const between = maxNrUnits / nNrs
        
        for(var i = 0; i < nNrs; i++) {
            let xPos = i * between * zoomWidth * unitSize - left
            let nr =  between * i
            numbers.push({x: xPos, val: nr})
        }

        return(
            <div style={style} onWheel={this.props.onWheel} onClick={this.onClick} className={classes.txt}>
                
                <Playline zoomWidth={zoomWidth} unitSize={unitSize} left={left}></Playline>
                
                <div style={{color:"white", position: "relative"}}>
                    {numbers.map((e) => 
                    <div key={e.val} >
                        <div 
                            style={{
                                left: e.x, 
                                position: "absolute", 
                                pointerEvents: "none", 
                                fontSize: 10, 
                                transform: "translateX(-50%)",
                                overflow: "hidden"
                                }}>
                            {this.convertTime(e.val)}
                        </div>
                        <div style={{backgroundColor:"white", width:1, height: 5, top:15, position:"absolute", zIndex: 10000, pointerEvents: "none", left: e.x}}></div>
                    </div>
                    )}
                    
                </div>
            </div>
        )
    }
}



export default Timeline
