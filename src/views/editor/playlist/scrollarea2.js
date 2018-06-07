import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'
import classes from "./scrollarea.css"

import ScrollTopPanel from './scrolltoppanel'
import ClipInfoBar from './clipinfobar'

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
        this.maxZoom = 400
        this.viewport = [0, 0, 1, 1]

        this.i = 0

        window.addEventListener("mouseup", this.windowMouseUp)
    }

    windowMouseUp = () => {
        if(this.timer)
            window.clearInterval(this.timer)
    }


    updateWindowDimensions = () => {
        const ref = this.scrollTopPanelRef.panelRef

        this.setState({ width: ref.offsetWidth, height: this.wrapperRef.offsetHeight})
    }

    componentDidMount() {
        const ref = this.scrollTopPanelRef.panelRef
        window.addEventListener('resize', this.updateWindowDimensions);        
        this.setState({ width: ref.offsetWidth, height: this.wrapperRef.offsetHeight})
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.windowMouseUp)
        window.removeEventListener('resize', this.updateWindowDimensions);
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
        let z = this.state.zoomWidth - 1 - (this.state.zoomWidth * 4 / this.maxZoom)
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

        const thumbX = Math.floor(this.viewport[0] * width)
        this.setState({
            zoomWidth: z,
            horizontalPosition: {x: thumbX, y: 0}
        })
    }

    zoomIn = (pos) => {
    
        

        if(this.state.zoomWidth !== this.maxZoom) {
            const width = this.state.width - 30
            let z = this.state.zoomWidth + 0.5 + (this.state.zoomWidth * 8 / this.maxZoom)
            z = z > this.maxZoom ? this.maxZoom : z
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
        const deltaY = e.deltaY > 0 ? 100 : -100

        this.scrollAreaRef.scrollTop += deltaY / 10
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
        const { zoomWidth, zoomHeight } = this.state
        const { maxNrUnits } = this.props
        const { width, height } = this.state

        this.unitSize = width / maxNrUnits
        

        const viewport = this.viewport
        const itemRightOffset = this.unitSize * zoomWidth //relative offset to zoom and unitsize

        const info = {width, height, zoomWidth, zoomHeight, unitSize: this.unitSize, viewport, maxNrUnits, itemRightOffset}

        return (
            <div ref={ref => this.wrapperRef = ref} style={{height: "100%", position: "relative"}} >
                <ScrollTopPanel
                        onDragHorizontal={this.onDragHorizontal}
                        horizontalPosition={this.state.horizontalPosition}
                        moveHorizontal ={this.moveHorizontal}
                        onClickHorizontal={this.onClickHorizontal}
                        onMouseUp={this.stopMovingHorizontally}
                        info={info}
                        ref={ref => this.scrollTopPanelRef = ref}
                        onWheel={this.onWheel}
                ></ScrollTopPanel>
                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref }  onWheel={this.gridScrolled} >
                    <ClipInfoBar info={info} selectedLayerId={this.props.selectedLayerId} ></ClipInfoBar>
                    <svg style={{position: "absolute", left: 0, zIndex: 1}} width={width*2} height={height + 1000} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width={itemRightOffset} height={35 * this.state.zoomHeight} patternUnits="userSpaceOnUse">
                                <path d={"M "+String(itemRightOffset)+" 0 L 0 0 "} fill="none" stroke="#434343" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className={classes.verticalTrack} onClick={this.onClickVertical}>
                    <Draggable
                        axis="y"
                        bounds={{ top: 0, bottom: this.state.height - 95}}
                        onDrag={this.onDragVertical}
                        position={this.state.verticalPosition}
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
        selectedLayerId: state.items.selectedLayerId
    }
}


export default connect(mapStateToProps )(ScrollArea2)