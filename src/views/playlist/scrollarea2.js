import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import classes from "./scrollarea.css"

import Clip from './clip'
import Timeline from './timeline'

import { connect } from 'react-redux'

class ScrollArea2 extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            horizontalPosition: { x: 0, y: 0 },
            verticalPosition: { x: 0, y: 0 },
            dragging: false,
            zoomWidth: 1,
            zoomHeight: 1,
        }
               
        this.lastScrollY = 0
        this.lastScrollX = 0
        this.viewport = [0, 0, 1, 1]
    }


    onDragStart = () => {
        this.setState({dragging: true})
    }

    onDragEnd = (e, b) => {
        this.setState({dragging: false })
    }

    onScroll = (e, v) => {

        console.log("scroll")

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
        const pos = b.x / (this.props.width - 30)
        const diff = this.viewport[2] - this.viewport[0]

        this.viewport[0] = pos 
        this.viewport[2] = pos + diff
        this.setState({horizontalPosition: { x: b.x, y: 0}})
        
        
        //this.scrollAreaRef.scrollLeft = (b.lastX / this.props.width) * (gridWidth - this.props.width)
    }

    onDragVertical = (e, b) => {
        const { gridHeight } = this.state
        this.setState({verticalPosition: { x: 0, y: b.y}})
        const scrollMax = this.scrollAreaRef.scrollHeight - this.scrollAreaRef.clientHeight
        const pos = b.y / (this.props.height -  115)
        this.scrollAreaRef.scrollTop = pos * scrollMax
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
        
        this.scrollAreaRef.scrollTop = (y/this.props.height)
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

    zoomOut = (pos) => {
        let z = this.state.zoomWidth - 1 
        z = z < 1 ? 1 : z
        
        const viewWidth  = 1 / z;
        const diff = (this.viewport[2] - this.viewport[0]) - viewWidth
        this.viewport[0] = this.viewport[0] + diff / 2
        this.viewport[2] = this.viewport[2] - diff / 2


        if(Math.abs( this.viewport[0] - this.viewport[2]) > 1) {
            this.viewport[0] = 0
            this.viewport[2] = 1
        }else {
            if(this.viewport[0] < 0){
                this.viewport[2] -= this.viewport[0]
                this.viewport[0] = 0
            }else if(this.viewport[2] > 1){
                this.viewport[0] += (1 - this.viewport[2])
                this.viewport[2] = 1
            }
        }

        const thumbX = Math.floor(this.viewport[0] * this.props.width)
        this.setState({
            zoomWidth: z,
            horizontalPosition: {x: thumbX, y: 0}
        })
    }

    zoomIn = (pos) => {
        const maxZoom = 50
        if(this.state.zoomWidth !== maxZoom) {
            const { width } = this.props
            let z = this.state.zoomWidth + 1
            z = z > maxZoom ? maxZoom : z
            const viewWidth  = 1 / z;
            const diff =  -(viewWidth - (this.viewport[2] - this.viewport[0]))

            this.viewport[0] = diff * pos + this.viewport[0]
            this.viewport[2] = this.viewport[2] - diff * (1-pos)
            
            const thumbX = Math.floor(this.viewport[0] * width)
            this.setState({
                zoomWidth: z,
                horizontalPosition: {x: thumbX, y: 0}
            })
        }
    }

    gridScrolled = (e) => {
        e.preventDefault()

        this.scrollAreaRef.scrollTop += e.deltaY / 10
        const scrollMax = this.scrollAreaRef.scrollHeight - this.scrollAreaRef.clientHeight
        const s = this.scrollAreaRef.scrollTop
        const pos = (s /scrollMax) * (this.props.height -  115)
        this.setState({verticalPosition: { x: 0, y:pos}})
    }

    onWheel = (e) => {
        const relativePos = this.getRelativeCoordinates(e)[0] / this.props.width
        if(e.deltaY > 0)
            this.zoomOut(relativePos)
        else {
            this.zoomIn(relativePos)
        }
    }

    render() {
        const dragHandlers = {onStart: this.onDragStart, onStop: this.onDragEnd}; 
        const { horizontalPosition, zoomWidth } = this.state
        const { width, maxNrUnits, height } = this.props

        this.unitSize = width / maxNrUnits

        const viewport = this.viewport
        const rOffset = this.unitSize * zoomWidth //relative offset to zoom and unitsize
        const thumbWidth = ((this.props.width - 30) * (this.viewport[2] - this.viewport[0])) 
        const gridOffset = -(this.viewport[0]* width * zoomWidth) % rOffset

        return (
            <div>
                <div className={classes.group1}>
                <div className={classes.button}></div>
                    <div className={classes.horizontalTrack} onClick={this.onClickHorizontal}>

                        <Draggable
                            axis="x"
                            bounds={{ left: 0, right: this.props.width - (thumbWidth + 30)}}
                            onDrag={this.onDragHorizontal}
                            position={this.state.horizontalPosition}
                            {...dragHandlers}
                        >
                            <div name="thumb" style={{width: thumbWidth }} className={classes.horizontalThumb} onClick={(e) => e.stopPropagation()}></div>
                        </Draggable>
                    </div>
                    <div className={classes.button}></div>
                </div>
                <Timeline 
                    scrollPosition={horizontalPosition.x} 
                    zoomWidth={zoomWidth} 
                    onWheel={this.onWheel}
                    viewport={viewport[0] * maxNrUnits*this.unitSize * zoomWidth}
                    unitSize={this.unitSize}
                    maxNrUnits={maxNrUnits}
                >
                </Timeline>

                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref} >
                    <div style={{width:"100%", display: "flex", flexDirection: "row", height: "100%"}}>
                        <div className={classes.bars}  onWheel={this.gridScrolled} >

                            <div className={classes.grid} ref={ref => this.gridRef = ref}>
                                {this.props.items.map((item, i) => {
                                    const { start, duration } = item
                                    const right = viewport[2] * maxNrUnits*this.unitSize * zoomWidth
                                    const left = viewport[0] * maxNrUnits*this.unitSize * zoomWidth

                                    if( ((start * rOffset) < right || (start + duration) * rOffset >= left) && true) {
                                        return (
                                            <Clip 
                                                key={item.id} 
                                                height={30 * this.state.zoomHeight}
                                                left={ (start * rOffset) - left}
                                                top={(i+1) * 30 * this.state.zoomHeight}
                                                zoomWidth={this.state.zoomWidth}
                                                item={item}
                                                rOffset={rOffset}
                                                unitSize={this.unitSize}
                                                >
                                            </Clip>
                                        )
                                    }

                                })}

                                <svg style={{position: "absolute", left: gridOffset, zIndex: 0}} width={width+rOffset} height={height + 1000} xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width={rOffset} height={30 * this.state.zoomHeight} patternUnits="userSpaceOnUse">
                                            <path d={"M "+String(rOffset)+" 0 L 0 0 0 "+String(80*this.state.zoomHeight)} fill="none" stroke="gray" strokeWidth="1" />
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
                        bounds={{ top: 0, bottom: this.props.height - 115}}
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


export default connect(mapStateToProps)(ScrollArea2)