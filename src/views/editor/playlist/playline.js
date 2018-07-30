
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

class Playline extends PureComponent {


    render() {
        const {  zoomWidth, time, unitSize, left } = this.props

        const l =  (time * zoomWidth * unitSize) - 6 - left - 1
        const m = l+6; 
        const r = m +6;

        return(
            <React.Fragment>
                <svg height="20" width="100%" style={{position:"absolute", zIndex: 1000, pointerEvents: "none"}}>
                    <polygon points={`${l},10 ${m},18 ${r},10`} style={{fill: "white", stroke: "gray", strokeWidth:1 }}/>
                </svg>

                <svg height="100%" width="100%" style={{position:"absolute", zIndex: 10, pointerEvents: "none"}}>
                    <line x1={String(m)} y1="20" x2={String(m)} y2="400" stroke="white" style={{strokeWidth: 1}}/>
                </svg>
            </React.Fragment>
        )
    }
} 

const mapStateToProps = state => {
    return {
        time: state.globals.time,
    }
}

export default connect(mapStateToProps)(Playline)