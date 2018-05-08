import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import classes from "./scrollarea.css"

import Clip from './clip'
import Timeline from './timeline'

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'


import { connect } from 'react-redux'

class ScrollArea2 extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            width: 1200,
            height: 2000,
            horizontalPosition: { x: 0, y: 0 },
            verticalPosition: { x: 0, y: 0 },
            dragging: false,
            zoomWidth: 1,
            zoomHeight: 1,
        }
               
        this.lastScrollY = 0
        this.lastScrollX = 0
        this.viewport = [0, 0, 1, 1]

        this.i = 0
    }


    onDragStart = () => {
        this.setState({dragging: true})
    }

    onDragEnd = (e, b) => {
        this.setState({dragging: false })
    }

    updateWindowDimensions = () => {
        this.setState({ width: this.panelRef.offsetWidth, height: this.wrapperRef.offsetHeight})
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.setState({ width: this.panelRef.offsetWidth, height: this.wrapperRef.offsetHeight})
    }

    onDragHorizontal = (e, b) => {
        const width = this.state.width -30

        const pos = b.x / width
        const diff = this.viewport[2] - this.viewport[0]
        this.viewport[0] = pos 
        this.viewport[2] = pos + diff
        this.setState({horizontalPosition: { x: b.x, y: 0}})
    }


    onDragVertical = (e, b) => {
        const { gridHeight } = this.state
        this.setState({verticalPosition: { x: 0, y: b.y}})
        const scrollMax = this.scrollAreaRef.scrollHeight - this.scrollAreaRef.clientHeight
        const pos = b.y / (this.state.height -  95)
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
        var [, y] = this.getRelativeCoordinates(evt)
        y = y >= 25 ? y - 25 : 0;
        y = y < this.state.height ? y : this.state.height

        const scrollMax = this.scrollAreaRef.scrollHeight - this.scrollAreaRef.clientHeight
        const pos = ((y / (this.state.height - 95)) * scrollMax)
        this.scrollAreaRef.scrollTop = (y /(this.state.height - 95)) * scrollMax
        this.setState({verticalPosition: { x: 0, y: y}})
    }

    onClickHorizontal = (evt) => {
        const width = this.state.width - 30
        var [x,] = this.getRelativeCoordinates(evt)
        const diff = this.viewport[2] - this.viewport[0]
        x = x + (diff * width) > width ? x + (width - (x + (diff * width))) : x

        const pos = x / width
        
        this.viewport[0] = pos 
        this.viewport[2] = pos + diff
        this.setState({horizontalPosition: { x: x, y: 0}})
    }

    onControlledDragStop(e, position) {
        this.onControlledDrag(e, position);
        this.onStop();
    }

    zoomOut = (pos) => {
        const width = this.state.width - 30
        let z = this.state.zoomWidth - 1 
        z = z < 1 ? 1 : z
        
        const viewWidth  = 1 / z;
        const diff = (this.viewport[2] - this.viewport[0]) - viewWidth  
        this.viewport[0] = this.viewport[0] + diff
        this.viewport[2] = this.viewport[2] - diff

        const d =  (this.viewport[2] - this.viewport[0])
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

        const tw = this.state.width * (this.viewport[2] - this.viewport[0])

        const thumbX = Math.floor(this.viewport[0] * width)
        this.setState({
            zoomWidth: z,
            horizontalPosition: {x: thumbX, y: 0}
        })
    }

    zoomIn = (pos) => {
        const maxZoom = 50
        if(this.state.zoomWidth !== maxZoom) {
            const width = this.state.width - 30
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

    move = (delta) => {
        const width = this.state.width - 30
        var x = this.state.horizontalPosition.x + delta * 2 
        const diff = this.viewport[2] - this.viewport[0]
        x = x > 0 ? x : 0
        //check > width + thumbwidth
        x = x + (diff * width) > width ? x + (width - (x + (diff * width))) : x

        const pos = x  / width
        this.viewport[0] = pos 
        this.viewport[2] = pos + diff
        this.setState({horizontalPosition: { x: pos * width, y: 0}})
    }

    moveHorizontal = (delta) => {
        this.timer = window.setInterval(() => this.move(delta), 20)
    }

    stopMovingHorizontally = () => {
        if(this.timer)window.clearInterval(this.timer)
    }

    gridScrolled = (e) => {
        e.preventDefault()

        this.scrollAreaRef.scrollTop += e.deltaY / 10
        const scrollMax = this.scrollAreaRef.scrollHeight - this.scrollAreaRef.clientHeight
        const s = this.scrollAreaRef.scrollTop
        const pos = (s /scrollMax) * (this.state.height -  95)
        this.setState({verticalPosition: { x: 0, y:pos}})
    }

    onWheel = (e) => {
        const relativePos = this.getRelativeCoordinates(e)[0] / this.state.width
        if(e.deltaY > 0)
            this.zoomOut(relativePos)
        else {
            this.zoomIn(relativePos)
        }
    }

    render() {
        const dragHandlers = {onStart: this.onDragStart, onStop: this.onDragEnd}; 
        const { horizontalPosition, zoomWidth } = this.state
        const { maxNrUnits } = this.props
        const { width, height } = this.state

        this.unitSize = width / maxNrUnits
        const viewport = this.viewport
        const rOffset = this.unitSize * zoomWidth //relative offset to zoom and unitsize
        const thumbWidth = ((width - 30) * (this.viewport[2] - this.viewport[0])) 
        const gridOffset = -(this.viewport[0]* width * zoomWidth) % rOffset

        return (
            <div ref={ref => this.wrapperRef = ref} style={{height: "100%", position: "relative"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{minWidth: "13%", width: "13%", height: "100%", backgroundColor: "#434343"}}>
                    <div style={{height: 35, backgroundColor: "#666666", width: "100%", borderBottom: "2px solid #232323"}}></div>
                </div>
                <div style={{width: "100%"}}>
                <div className={classes.group1} ref={ref => this.panelRef = ref} >
                    <KeyboardArrowLeft onMouseUp={this.stopMovingHorizontally} onMouseDown={() => this.moveHorizontal(-1)} className={classes.button}></KeyboardArrowLeft>
                    <div className={classes.horizontalTrack}  onClick={this.onClickHorizontal}>
                        <Draggable
                            axis="x"
                            bounds={{ left: 0, right: width - (thumbWidth + 30)}}
                            onDrag={this.onDragHorizontal}
                            position={this.state.horizontalPosition}
                            {...dragHandlers}
                        >
                            <div name="thumb" style={{width: thumbWidth }} className={classes.horizontalThumb} onClick={(e) => e.stopPropagation()}></div>
                        </Draggable>
                    </div>
                    <KeyboardArrowRight onMouseUp={this.stopMovingHorizontally} onMouseDown={() => this.moveHorizontal(1)} className={classes.button}></KeyboardArrowRight>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <Timeline 
                        scrollPosition={horizontalPosition.x} 
                        zoomWidth={zoomWidth} 
                        onWheel={this.onWheel}
                        viewport={viewport}
                        left={viewport[0] * maxNrUnits*this.unitSize * zoomWidth}
                        unitSize={this.unitSize}
                        maxNrUnits={maxNrUnits}
                    >
                    </Timeline>

                    <div className={classes.button} style={{backgroundColor: "black", width: 15, height: 20}}></div>
                </div>
                </div>
                </div>
                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref} >
                    <div style={{width: "15%", zIndex: 3, backgroundColor: "#434343", overflow: "hidden"}} >
                        
                       {[...Array(20)].map((e,i ) => {
                            const item = this.props.items[i]
                            var str = null
                            if(item)
                                str = item.name.length  < 10 ? item.name : item.name.substring(0, 25) + "..."
                            return (
                               <div key={i} 
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        fontSize: 10,
                                        color: "#D9D9D9",
                                        height: 30,
                                        backgroundColor:i%2===0?"#838383":"#636363",
                                    }}>
                                    <div>
                                        <div style={{marginLeft: 3}}>
                                            {i + 1}
                                        </div>
                                        <div style={{marginTop: 2, marginLeft: 15, color: "white", fontSize: 16}}>
                                            {str}
                                        </div>
                                    </div>
                                    <div style={{marginTop: 5}}>
          
                                    </div>
                                </div>
                           )
                       })}
                    
                    </div>

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
                                                top={i * 30 * this.state.zoomHeight}
                                                zoomWidth={this.state.zoomWidth}
                                                item={item}
                                                rOffset={rOffset}
                                                unitSize={this.unitSize}
                                                >
                                            </Clip>
                                        )
                                    }
                                })}
                                <svg style={{position: "absolute", zIndex: 1}} width={width*2} height={height + 1000} xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width={rOffset} height={30 * this.state.zoomHeight} patternUnits="userSpaceOnUse">
                                            <path d={"M "+String(rOffset)+" 0 L 0 0 "} fill="none" stroke="#434343" strokeWidth="1" />
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
                        bounds={{ top: 0, bottom: this.state.height - 95}}
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