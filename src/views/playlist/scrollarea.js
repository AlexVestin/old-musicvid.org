import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import classes from "./scrollarea.css"

import Clip from './clip'
import Timeline from './timeline'

import { connect } from 'react-redux'

class ScrollArea extends PureComponent {

    constructor(props) {
        super()
        this.state = {
            horizontalPosition: { x: 0, y: 0 },
            verticalPosition: { x: 0, y: 0 },
            dragging: false,
            gridWidth: 6000,
            gridHeight: 2000,
            zoomWidth: 1,
            zoomHeight: 1 
        }

        this.lastScrollY = 0
        this.lastScrollX = 0
    }

    onDragStart = () => {
        this.setState({dragging: true})
    }

    onDragEnd = (e, b) => {
        this.setState({
            dragging: false, 
            horizontalPosition: { x: b.lastX, y: 0},
            verticalPosition: { x: 0, y: b.lastY}
        })
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
        const widthOffset = (this.props.width / gridWidth) * gridWidth
        this.scrollAreaRef.scrollLeft = (b.lastX / this.props.width) * (gridWidth - widthOffset)
    }

    onDragVertical = (e, b) => {
        const { gridHeight } = this.state
        const heightOffset = this.props.height / gridHeight * gridHeight 
        this.scrollAreaRef.scrollTop = (b.lastY / this.props.height) * (gridHeight - heightOffset)
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
        var [x, y] = this.getRelativeCoordinates(evt)
        y = y >= 25 ? y - 25 : 0;
        y = y < this.props.width ? y : this.props.width
        this.scrollAreaRef.scrollTop = (y/this.props.height)*gridHeight
    }

    onClickHorizontal = (evt) => {
        const { gridWidth } = this.state
        var [x, y] = this.getRelativeCoordinates(evt)
        x = x >= 25 ? x - 25 : 0;
        x = x < this.props.width ? x : this.props.width

        const widthOffset = (this.props.width / gridWidth) * gridWidth
        this.scrollAreaRef.scrollLeft = (x/this.props.width)*(gridWidth-widthOffset)
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
        let z = 
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
        const { gridHeight, gridWidth } = this.state

        return (
            <div>
                <div className={classes.group1}>
                    <div className={classes.horizontalTrack} onClick={this.onClickHorizontal}>
                        <Draggable
                            axis="x"
                            bounds={{ left: 0, right: this.props.width - 65 }}
                            onDrag={this.onDragHorizontal}
                            position={this.state.horizontalPosition}
                            {...dragHandlers}
                        >
                            <div name="thumb" className={classes.horizontalThumb} onClick={(e) => e.stopPropagation()}></div>
                        </Draggable>
                    </div>
                    <div className={classes.button}></div>
                </div>
                <Timeline scrollPosition={this.horizontalPosition} zoomWidth={this.state.zoomWidth} onWheel={this.onWheel}></Timeline>

                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref} onScroll={this.onScroll}>
                    <div className={classes.group2} >
                        <div className={classes.bars} >

                            <div className={classes.grid} ref={ref => this.gridRef = ref}>
                                {this.props.items.map((e, i) => {
                                    return (
                                        <Clip 
                                            key={e.id.value} 
                                            width={e.duration.value * this.state.zoomWidth} 
                                            start={e.start.value} 
                                            height={30 * this.state.zoomHeight}
                                            top={i * 30 * this.state.zoomHeight}
                                            zoomWidth={this.state.zoomWidth}
                                            item={this.props.items[i]}
                                            >
                                        </Clip>
                                    )
                                })}

                                <svg width= {String(gridWidth)+"px"} height={String(gridHeight)+"px"} xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width={50 * this.state.zoomWidth} height={30 * this.state.zoomHeight} patternUnits="userSpaceOnUse">
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
                        bounds={{ top: 0, bottom: this.props.height - 65}}
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