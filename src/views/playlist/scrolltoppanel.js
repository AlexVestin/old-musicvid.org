import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Timeline from './timeline'
import classes from './scrolltoppanel.css'
export default class ScrollTopPane extends PureComponent {

    render() {

        const {zoomWidth, viewport, width, maxNrUnits, unitSize } = this.props.info
        const { onDragHorizontal, moveHorizontal, onWheel, horizontalPosition, onMouseUp, onClickHorizontal } = this.props
        const thumbWidth = ((width - 30) * (viewport[2] - viewport[0])) 
        
        const iconWidth = 15
        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ minWidth: "20%", width: "20%", height: "100%", backgroundColor: "#434343" }}>
                    <div style={{ height: 35, backgroundColor: "#666666", width: "100%", borderBottom: "2px solid #232323" }}></div>
                </div>
                <div style={{ width: "100%" }}>
                    <div className={classes.group1} ref={ref => this.panelRef = ref} >
                    <div style={{minWidth: iconWidth, minHeight: iconWidth}}>
                        <KeyboardArrowLeft  style={{width: iconWidth, height: iconWidth}} className={classes.button} onMouseUp={onMouseUp} onMouseDown={() => moveHorizontal(-1)} ></KeyboardArrowLeft>
                    </div>
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
                        <div style={{minWidth: iconWidth, minHeight: iconWidth}}>
                            <KeyboardArrowRight style={{maxWidth: iconWidth, minWidth: iconWidth, width: iconWidth, height: iconWidth}} className={classes.button}  onMouseUp={onMouseUp} onMouseDown={() => moveHorizontal(1)}></KeyboardArrowRight>
                        </div>
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