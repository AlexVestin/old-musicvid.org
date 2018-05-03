import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'

import { editItem, selectItem } from '../../redux/actions/items'

const colors = ["green", "red", "brown", "blue"]

export default class Clip extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            position: {x: props.left, y: props.top},
            resizing: false,
            dx: 0
        }

        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.dx
    }

    onMouseDown = (e) => {
        selectItem(this.props.item)
        this.mouseDown = true
        this.startX = e.clientX
    }

    onMouseUp = (e) => {
        this.mouseDown = false
        const { item, rOffset } = this.props
        this.endX = e.clientX

        if(item.start + (this.endX  - this.startX) / rOffset >= 0) {
            editItem({key: "start", value: item.start + (this.endX-this.startX) / rOffset })
        }else {
            editItem({key: "start", value: 0 })
        }
            
        this.setState({dx: 0})
        this.startX = this.endX = 0
    }

    onMouseMove = (e) => {
        const { item, rOffset, left } = this.props
        if(this.mouseDown) {
            if(item.start + (e.clientX  - this.startX) / rOffset >= 0) {
                this.setState({dx: e.clientX  - this.startX})
            }else {
                this.setState({dx: -left})
            }
                
        }
    }


    onClick = (e) => {
        selectItem(this.props.item)
    }

    onStop = (e, b) => {
        if(this.props.item.start !== b.x) {
            selectItem(this.props.item)
            editItem({key: "start", value: b.x / ( this.props.zoomWidth * this.props.unitSize)})
        }
    }
 
    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    onDragStart = (e) => {
        this.startX = e.clientX

        e.dataTransfer.setData('text',''); 
    }

    onDragEnd = (e) => {
        const { item, rOffset } = this.props
        this.endX = e.clientX

        editItem({key: "start", value: item.start + (this.endX-this.startX) / rOffset })
        this.setState({dx : 0})
        this.startX = this.endX = 0
    }

    onDrag = (e) => {
        const x = e.clientX
        this.setState({dx: x - this.startX})
    }

    clipDragged = (e, b) => {
        this.setState({position: {x:b.x / this.props.unitSize, y: this.state.position.y}})
    }

    componentWillReceiveProps(props) {
        const { height, top, item, zoomWidth, unitSize } = this.props

        if(this.state.position.x  !== props.item.start * props.zoomWidth * this.props.unitSize){
            this.setState({position: {x: Math.floor(props.item.start * props.zoomWidth * this.props.unitSize), y: props.top} })
        }
    }

    render() {        
        /*
                 draggable="true"
                onDrag={this.onDrag}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
        */

        const { height, top, item, zoomWidth, unitSize, left } = this.props
        let w = this.props.item.duration * zoomWidth * unitSize 

        let l = left + this.state.dx 
        return (
            <div 
                onClick={this.onClick}
                style={{position:"relative", display: "flex", flexDirection: "row", zIndex: 2}} 
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
            >
                <div 
                    style={{
                        position: "absolute",
                        overflow: "hidden",
                        width: w, 
                        top:top, 
                        height:height, 
                        left: l,
                        backgroundColor:this.color, 
                        border: "solid",
                        borderRadius: "0.12rem", 
                        borderWidth: 1,
                        borderColor: '#555555'
                    }}>
                    <div 
                        style={{
                            width: "100%",
                            backgroundColor: "rgba(2,2,2,0.6)",
                            fontSize: 12, 
                            fontFamily: "'Lucida Console', Monaco, monospace", 
                            color:"white", 
                            pointerEvents: "none", 
                            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
                            MozUserSelect:"none",
                            WebkitUserSelect:"none",
                            msUserSelect:"none"
                        }}
                        >
                        {item.name}
                    </div>
                </div>
            </div>
        )
    }
}
