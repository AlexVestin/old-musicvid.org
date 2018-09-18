import React, { Component } from 'react'
import Draggable from 'react-draggable'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Timeline from './timeline'
import classes from './scrolltoppanel.css'


class ArrowIcon extends Component  {
    shouldComponentUpdate = () => false

    render() {
        const direction = this.props.left ? -1 : 1
        const style = {width: 15, height: 15}
        const neProps = {style, onMouseUp: this.props.onMouseUp, onMouseDown: () => this.props.onMouseDown(direction), className: classes.button}
        return (
            <div style={{minWidth: 15, minHeight: 15}}>
                {this.props.left ? <KeyboardArrowLeft {...neProps}></KeyboardArrowLeft> : <KeyboardArrowRight {...neProps}></KeyboardArrowRight>}
            </div>
        )
    }
}
export default class ScrollTopPane extends Component {

    render() {

        const {zoomWidth, viewport, width, maxNrUnits, unitSize } = this.props.info
        const { onDragHorizontal, moveHorizontal, onWheel, horizontalPosition, onMouseUp, onClickHorizontal } = this.props
        const thumbWidth = ((width - 30) * (viewport[2] - viewport[0])) 
        
        return (
            <div style={{ display: "flex", flexDirection: "row" }} draggable="false">
                <div style={{ minWidth: "calc(20% - 1px)", width: "calc(20% - 1px)", height: "100%", backgroundColor: "#434343" }}>
                    <div style={{ height: 35, backgroundColor: "#666666", width: "calc(100% - 2px)", borderBottom: "2px solid rgba(0,0,0,.42)", borderRight: "2px solid rgba(0,0,0,.42)" }}></div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className={classes.group1} ref={ref => this.panelRef = ref} >
                    <ArrowIcon onMouseDown={moveHorizontal} onMouseUp={onMouseUp} left={true} ></ArrowIcon>
                    <div className={classes.horizontalTrack} onClick={onClickHorizontal} >
                        <Draggable
                            axis="x"
                            bounds={{ left: 0, right: width - (thumbWidth + 30) }}
                            onDrag={onDragHorizontal}
                            position={horizontalPosition}
                        >
                        <div name="thumb" style={{ width: thumbWidth }} className={classes.horizontalThumb} onClick={(e) => e.stopPropagation()}></div>
                        </Draggable>
                    </div>
                    <ArrowIcon onMouseDown={moveHorizontal} onMouseUp={onMouseUp} left={false} ></ArrowIcon>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Timeline
                            scrollPosition={horizontalPosition.x}
                            zoomWidth={zoomWidth}
                            onWheel={onWheel}
                            viewport={viewport}
                            left={viewport[0] * maxNrUnits * unitSize * zoomWidth}
                            unitSize={unitSize}
                            maxNrUnits={maxNrUnits}
                        >
                        </Timeline>

                        <div className={classes.button} style={{ backgroundColor: "black", width: 15, height: 20 }}></div>
                    </div>
                </div>
            </div>
        )
    }
}