import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import classes from "./scrollarea.css"

import Clip from './clip'
import Timeline from './timeline'

import { connect } from 'react-redux'

class ScrollArea extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            horizontalPosition: { x: 0, y: 0 },
            verticalPosition: { x: 0, y: 0 },
            dragging: false,
            zoomWidth: 1,
            zoomHeight: 1 
        }
        
        this.unitSize = 20
        this.maxWidth = (10 * 60 * this.unitSize) / this.state.zoomWidth   // 10 minutes -- 1 second = 50px in basezoom
        this.lastScrollY = 0
        this.lastScrollX = 0
        this.viewport = [0, 0, props.width, props.height]
    }

    onDragStart = () => {
        this.setState({dragging: true})
    }

    onDragEnd = (e, b) => {
        this.setState({dragging: false })
    }

    onScroll = (e, v) => {

        if(!this.state.dragging) {  
            const { gridHeight, gridWidth } = this.state
        
            const widthOffset = (this.props.width / gridWidth) * gridWidth
            const heightOffset = this.props.height / gridHeight * gridHeight 
            
            if(this.lastScrollY > e.target.scrollTop){
                this.setState({ 
                    verticalPosition: { x: 0, y: (e.target.scrollTop /( gridHeight - heightOffset)) * this.props.height }
                })
            }else {
                this.setState({
                    horizontalPosition: { x: (e.target.scrollLeft / (gridWidth - widthOffset)) * this.props.width, y: 0 }
                })
            }
        }
    }

    onDragHorizontal = (e, b) => {
        const { gridWidth } = this.state
        this.setState({horizontalPosition: { x: b.x, y: 0}})

        this.viewport[0] = Math.floor(this.maxWidth * this.state.zoomWidth * (b.x / this.props.width))
        this.viewport[2] = this.viewport[0] + (this.props.width * this.state.zoomWidth)
        //this.scrollAreaRef.scrollLeft = (b.lastX / this.props.width) * (gridWidth - this.props.width)
    }

    onDragVertical = (e, b) => {
        const { gridHeight } = this.state

        this.setState({verticalPosition: { x: 0, y: b.lastY}})
        //this.scrollAreaRef.scrollTop = (b.lastY / this.props.height) * (gridHeight - this.props.height)
    }


    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    onClickVertical = (evt) => {
        const { gridHeight } = this.state
        var [, y] = this.getRelativeCoordinates(evt)
        y = y >= 25 ? y - 25 : 0;
        y = y < this.props.width ? y : this.props.width
        
        //this.scrollAreaRef.scrollTop = (y/this.props.height)
    }

    onClickHorizontal = (evt) => {
        const { gridWidth } = this.state
        var [x, ] = this.getRelativeCoordinates(evt)
        x = x >= 25 ? x - 25 : 0;
        x = x < this.props.width ? x : this.props.width

        //const widthOffset = (this.props.width / gridWidth) * gridWidth
        //this.scrollAreaRef.scrollLeft = (x/this.props.width)*(gridWidth-widthOffset)
    }

    onControlledDragStop(e, position) {
        this.onControlledDrag(e, position);
        this.onStop();
    }

    zoomIn = () => {
        let z = this.state.zoomWidth - 0.12
        if(z <= 0)
            z = 0.1
        this.setState({
            zoomWidth: z
        })
    }

    zoomOut = () => {
        this.setState({
            zoomWidth: this.state.zoomWidth + 0.12,
        })
    }

    onWheel = (e) => {
        if(e.deltaY > 0)
            this.zoomIn()
        else {
            this.zoomOut()
        }
    }

    render() {
        const dragHandlers = {onStart: this.onDragStart, onStop: this.onDragEnd}; 
        const { horizontalPosition, gridWidth, zoomWidth, gridHeight } = this.state
        const { width } = this.props

        const viewport = this.viewport
        const rOffset = this.unitSize / zoomWidth //relative offset to 
        this.maxWidth = (10 * 60 * this.unitSize) * this.state.zoomWidth   // 10 minutes -- 1 second = 50px in basezoom
        return (
            <div>
                <div className={classes.group1}>
                    <div className={classes.horizontalTrack} onClick={this.onClickHorizontal}>
                        <Draggable
                            axis="x"
                            bounds={{ left: 0, right: this.props.width}}
                            onDrag={this.onDragHorizontal}
                            position={this.state.horizontalPosition}
                            {...dragHandlers}
                        >
                            <div name="thumb" className={classes.horizontalThumb} onClick={(e) => e.stopPropagation()}></div>
                        </Draggable>
                    </div>
                    <div className={classes.button}></div>
                </div>
                <Timeline 
                    scrollPosition={horizontalPosition} 
                    zoomWidth={zoomWidth} 
                    scrollOffset={(horizontalPosition.x / width) * (this.maxWidth-width)}
                    onWheel={this.onWheel}
                    gridWidth={this.maxWidth}
                    unitSize={this.unitSize}
                >
                </Timeline>

                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref} onScroll={this.onScroll}>
                    <div style={{width:"100%", display: "flex", flexDirection: "row", height: "100%"}}>
                        <div className={classes.bars} >

                            <div className={classes.grid} ref={ref => this.gridRef = ref}>
                                {this.props.items.map((item, i) => {
                                    const { start, duration } = item
                                    if( (start * rOffset) < viewport[2] && (start + duration) * rOffset >= viewport[0] && true) {
                                        return (
                                        
                                            <Clip 
                                                key={item.id} 
                                                height={30 * this.state.zoomHeight}
                                                left={ (item.start * rOffset) - viewport[0]}
                                                top={(i+1) * 30 * this.state.zoomHeight}
                                                zoomWidth={this.state.zoomWidth}
                                                item={item}
                                                unitSize={this.unitSize}
                                                >
                                            </Clip>
                                        )
                                    }

                                })}

                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width={this.unitSize * this.state.zoomWidth} height={30 * this.state.zoomHeight} patternUnits="userSpaceOnUse">
                                            <path d={"M "+String(80*this.state.zoomWidth)+" 0 L 0 0 0 "+String(80*this.state.zoomHeight)} fill="none" stroke="gray" strokeWidth="1" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classes.verticalTrack} onClick={this.onClickVertical}>
                    <Draggable
                        axis="y"
                        bounds={{ top: 0, bottom: this.props.height}}
                        onDrag={this.onDragVertical}
                        position={this.state.verticalPosition}
                        {...dragHandlers}
                    >
                        <div className={classes.verticalThumb} onClick={(e) => e.stopPropagation()}></div>
                    </Draggable>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}


export default connect(mapStateToProps)(ScrollArea)