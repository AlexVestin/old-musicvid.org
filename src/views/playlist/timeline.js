import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { setTime } from '../../redux/actions/globals'

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
        const { left, zoomWidth, unitSize, maxNrUnits } = this.props
        const [x, ] = this.getRelativeCoordinates(evt)

        const t = x/(zoomWidth * unitSize) + left / (zoomWidth * unitSize)
        setTime(t)
    }

    convertTime = (sec) => {
        var min = Math.floor(sec/60);
        (min >= 1) ? sec = sec - (min*60) : min = '00';
        (sec < 1) ? sec='00' : void 0;

        (min.toString().length == 1) ? min = '0'+min : void 0;    
        (sec.toString().length == 1) ? sec = '0'+sec : void 0;    
        return min+':'+sec;
    }

    render() {
        const { maxNrUnits, zoomWidth, time, scrollOffset, unitSize, left, viewport } = this.props
        const l =  (time * zoomWidth * unitSize) - 6 - left
        const m = l+6; const r = m +6;

        let numbers = []
        const nNrs = 20
        for(var i = 0; i < nNrs; i++) {
            let xPos = i * (maxNrUnits / nNrs) * zoomWidth * unitSize - left
            let nr =  (maxNrUnits /  nNrs) * i
            numbers.push({x: xPos, val: nr})
        }

        return(
            <div style={style} onWheel={this.props.onWheel} onClick={this.onClick}>
                <svg height="20" width="100%" style={{position:"absolute", zIndex: 1000, pointerEvents: "none"}}>
                    <polygon points={`${l},10 ${m},18 ${r},10`} style={{fill: "white", stroke: "gray", strokeWidth:1 }}/>
                </svg>

                <svg height="100%" width="100%" style={{position:"absolute", zIndex: 10000, pointerEvents: "none"}}>
                    <line x1={String(m)} y1="20" x2={String(m)} y2="400" stroke="white" style={{strokeWidth: 1}}/>
                </svg>

                <div style={{color:"white", position: "relative"}}>
                    {numbers.map((e) => 
                    <div 
                        key={e.val} 
                        style={{
                            left: e.x, 
                            position: "absolute", 
                            pointerEvents: "none", 
                            fontSize: 10, 
                            transform: "translateX(-50%)",
                            overflow: "hidden"
                            }}>
                        {this.convertTime(e.val)}
                    </div>)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        time: state.globals.time
    }
}

export default connect(mapStateToProps)(Timeline)
