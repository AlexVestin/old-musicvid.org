import React, { PureComponent } from 'react'
import classes from "./playlist.css"
import SimpleTabs from './tabs'

import Draggable from 'react-draggable'

class ScrollArea extends PureComponent {

    constructor() {
        super()
        this.state = {
            horizontalPosition: { x: 0, y: 0 },
            verticalPosition: { x: 0, y: 0 },
            dragging: false
        }

        this.gridWidth = 6000
        this.gridHeight = 2000

    }

    onDragStart = () => {
        this.setState({dragging: true})
    }

    onDragEnd = () => {
        this.setState({dragging: false})
    }

    onScroll = (e, v) => {
        console.log(this.state.dragging)
        if(!this.state.dragging) {
            
            const xScale = this.props.width / this.gridWidth
            const yScale = this.props.height / this.gridHeight
            
            this.setState({
                horizontalPosition: { x: (e.target.scrollLeft / this.gridWidth) * this.props.width, y: 0 },
                verticalPosition: { x: 0, y: (e.target.scrollTop / this.gridHeight) * this.props.height }
            })
        }
    }

    onDragHorizontal = (e, b) => {
        const xScale = this.props.width / this.gridWidth
        this.setState({ horizontalPosition: { x: b.lastX, y: 0 } })
        this.scrollAreaRef.scrollLeft = b.lastX / xScale;
    }

    onDragVertical = (e, b) => {
        const yScale = this.props.height / this.gridHeight

        this.setState({ verticalPosition: { x: 0, y: b.lastY} })
        this.scrollAreaRef.scrollTop = b.lastY / yScale;
    }

    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    onClickVertical = (evt) => {
        var [x, y] = this.getRelativeCoordinates(evt)
        y = y >= 25 ? y - 25 : 0;
        y = y < this.props.width ? y : this.props.width
        this.setState({ verticalPosition: { x: 0, y } })
    }

    onClickHorizontal = (evt) => {
        var [x, y] = this.getRelativeCoordinates(evt)
        x = x >= 25 ? x - 25 : 0;
        x = x < this.props.width ? x : this.props.width
        this.setState({ horizontalPosition: { x, y: 0 } })
    }

    onControlledDragStop(e, position) {
        this.onControlledDrag(e, position);
        this.onStop();
    }

    render() {
        const dragHandlers = {onStart: this.onDragStart, onStop: this.onDragEnd}; 

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
                <div className={classes.timebar}></div>
                <div className={classes.scrollArea} ref={ref => this.scrollAreaRef = ref} onScroll={this.onScroll}>
                    <div className={classes.group2} >
                        <div className={classes.bars} >
                            <div className={classes.grid} ref={ref => this.gridRef = ref}>
                                <svg width="6000px" height="1000px" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1" />
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
                        bounds={{ top: 0, bottom: this.props.height }}
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


export default class Playlist extends PureComponent {
    constructor(props) {
        super(props)

        this.state = { width: 1200, height: 2000 }
    }

    updateWindowDimensions = () => {
        this.setState({ width: this.wrapperRef.offsetWidth, height: this.wrapperRef.offsetHeight })
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        this.setState({ width: this.wrapperRef.offsetWidth , height: this.wrapperRef.offsetHeight })
    }

    render() {
        return (
            <div className={classes.wrapper} ref={ref => this.wrapperRef = ref}>
                <div className={classes.header}>
                    <SimpleTabs className={classes.tabs}></SimpleTabs>
                </div>
                <div className={classes.scrollbarWrapper}>
                    <ScrollArea width={this.state.width} height={this.state.height} > </ScrollArea>
                </div>

            </div>
        )
    }
}