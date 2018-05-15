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
            dx: 0,
            resizeLeftDx: 0,
            resizeRightDx: 0,
            
        }

        this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.onMouseUp)
        window.removeEventListener("mousemove", this.onMouseMove)
        
    }
    componentDidMount() {
        window.addEventListener("mouseup", this.onMouseUp)
        window.addEventListener("mousemove", this.onMouseMove)
    }

    onMouseDown = (e) => {
        console.log("ppp")
        if(this.props.item.movable && !this.mouseDown && !this.resizeMouseDown) {
            selectItem({itemId: this.props.item.id, layerId: this.props.item.sceneId})
            this.mouseDown = true
            this.startX = e.clientX
        }
    }

    onMouseUp = (e) => {
        const { item, itemRightOffset } = this.props
        this.endX = e.clientX
        if(this.props.item.movable && this.mouseDown ) {
            this.mouseDown = false
            
            editItem({key: "start", value: item.start + (this.state.dx) / itemRightOffset })
            this.setState({dx: 0})
        }

        if(this.resizeMouseDown) {
            this.resizeMouseDown = false
            const left = item.start + ((this.state.dx + this.state.resizeLeftDx) / itemRightOffset)
            const duration = item.duration + (this.state.resizeRightDx - this.state.resizeLeftDx) / itemRightOffset
            
            
            editItem({key: "start", value: left})
            editItem({key: "duration", value: duration})

            this.setState({resizeLeftDx: 0, resizeRightDx: 0})
        }

        this.startX = this.endX = 0
    }

    onMouseMove = (e) => {
        const { item, itemRightOffset, left } = this.props
        if(this.props.item.movable && this.mouseDown) {
            if(item.start + (e.clientX  - this.startX) / itemRightOffset >= 0) {
                this.setState({dx: e.clientX  - this.startX})
            }else {
                this.setState({dx: -left})
            } 
        }

        if(this.resizeMouseDown){

            if(this.resizeLeft) {
                if(item.start + (e.clientX  - this.startX) / itemRightOffset >= 0) {
                    this.setState({resizeLeftDx: e.clientX  - this.startX})
                }else {
                    this.setState({resizeLeftDx: -left})
                } 
            }else {
                this.setState({resizeRightDx: e.clientX  - this.startX})
            }
        }
    }

    resize = (resizeLeft, evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        if( !this.resizeMouseDown && !this.mouseDown) {
            selectItem({itemId: this.props.item.id, layerId: this.props.item.sceneId})
            this.startX = evt.clientX
            this.resizeMouseDown = true
            this.resizeLeft = resizeLeft
        }
    }



    onStop = (e, b) => {
        if(this.props.item.movable) {
            if(this.props.item.start !== b.x) {
                editItem({key: "start", value: b.x / ( this.props.zoomWidth * this.props.unitSize)})
            }
        }
    }
 
    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    
    componentWillReceiveProps(props) {
        if(this.state.position.x  !== props.item.start * props.zoomWidth * props.unitSize){
            this.setState({position: {x: Math.floor(props.item.start * props.zoomWidth * props.unitSize), y: props.top} })
        }
    }

    render() {    
        const { height, top, item, zoomWidth, unitSize, left } = this.props
        let w = (item.duration * zoomWidth * unitSize) + this.state.resizeRightDx - this.state.resizeLeftDx

        let l = left + this.state.dx + this.state.resizeLeftDx


        const resizeWidth = w  > 24 ? 12 : Math.floor(w / 4)
        const resizeStyle = {
            position: "absolute",
            top: 0,
            width: resizeWidth,
            height: height
        }
        return (
            <div 
                onClick={this.onClick}
                style={{position:"relative", display: "flex", flexDirection: "row", zIndex: 2}} 
                onMouseDown={this.onMouseDown}
            >

                <div 
                    style={{
                        position: "absolute",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: w, 
                        top: top, 
                        height:height, 
                        left: l,
                        backgroundColor: this.color, 
                        border: "solid",
                        boxSizing: "border-box",
                        borderRadius: "0.12rem", 
                        borderWidth: 1,
                        borderColor: '#555555',
                    }}>
                    
                    <div 
                        style={{
                            width: "100%",
                            position: "relative",
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
                        <div onMouseDown={(evt) => this.resize(true, evt)} style={{...resizeStyle,  left:  -resizeWidth / 2, cursor: "w-resize"}}></div>
                        <div onMouseDown={(evt) => this.resize(false, evt)} style={{...resizeStyle,  right: -resizeWidth / 2, cursor: "e-resize"}}></div>
                </div>
            </div>
        )
    }
}

const Bar = (props) => {

}
