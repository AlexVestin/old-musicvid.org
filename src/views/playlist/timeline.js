import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

const style = {
    backgroundColor: "#222222",
    minHeight: "15px",
    height: "15px"
}

class Timeline extends PureComponent {


    render() {
        const { zoomWidth, time } = this.props
        const l =  (time * zoomWidth * 100) - 8
        const m = l+8; const r = m +8;

        return(
            <div style={style} onWheel={this.props.onWheel}>
            <svg height="20" width="100%">
                <polygon points={`${l},0 ${m},16 ${r},0`} style={{fill: "lime", stroke: "purple", strokeWidth:1 }}/>
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
