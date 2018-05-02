import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { setTime } from '../../redux/actions/globals'

const style = {
    backgroundColor: "#222222",
    minHeight: "15px",
    height: "15px",
    width: "100%"
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
        const { viewport, zoomWidth, unitSize, maxNrUnits } = this.props
        const [x, ] = this.getRelativeCoordinates(evt)

        const t = x/(zoomWidth * unitSize) + viewport / (zoomWidth * unitSize)
        setTime(t)
    }

    render() {
        const { zoomWidth, time, scrollOffset, unitSize, viewport } = this.props
        const l =  (time * zoomWidth * unitSize) - 6 - (viewport)
        const m = l+6; const r = m +6;

        return(
            <div style={style} onWheel={this.props.onWheel} onClick={this.onClick}>
            <svg height="20" width="100%" style={{position:"absolute", zIndex: 1000, pointerEvents: "none"}}>
                <polygon points={`${l},8 ${m},16 ${r},8`} style={{fill: "white", stroke: "gray", strokeWidth:1 }}/>
            </svg>
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
