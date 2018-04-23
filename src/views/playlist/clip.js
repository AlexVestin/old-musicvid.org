import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'

import classes from "./clip.css"
import { editItem, selectItem } from '../../redux/actions/items'

const colors = ["green", "red", "brown", "blue"]
const style = {}

export default class Clip extends PureComponent {
    constructor(props) {
        super(props)
        
        this.state = {
            position: {x: 0, y: props.top},
            resizing: false,
        }

        this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    onClick = (e) => {
        e.stopPropagation()
        selectItem(this.props.item)
    }

    onStop = (e, b) => {
        if(this.props.item.start.value !== b.x) {
            selectItem(this.props.item)
            editItem({key: "start", value: b.x / this.props.zoomWidth})
        }
    }
 


    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    clipDragged = (e, b) => {
        this.setState({position: {x: b.x, y: this.state.position.y}})
    }

    componentWillReceiveProps(props) {
        if(this.state.position.x  !== props.start * props.zoomWidth){
            this.setState({position: {x: props.start * props.zoomWidth, y: props.top} })
        }
    }

    render() {
        const { width, height, top, item, zoomWidth } = this.props
        return (
            
            <div onClick={this.onClick} style={{position:"absolute", display: "flex", flexDirection: "row"}}>
                <Draggable onDrag={this.clipDragged} axis="x" onClick={this.onClick} onStop={this.onStop} bounds={{left: 0}} position={this.state.position}>
                    <div style={{width: this.props.width*zoomWidth, height, backgroundColor:this.color, overflow:"hidden", borderRadius: "2px", borderWidth: 0.5,borderColor: '#d6d7da'} }  >
                        <div style={{fontSize: 12, fontFamily: "'Lucida Console', Monaco, monospace", color:"white", pointerEvents: "none", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}}>
                            {item.name.value}
                        </div>
                    </div>
                </Draggable>
            </div>
        )
    }
}
/* 
<div 
        style={{left: (this.state.position.x+ (width*zoomWidth) )}} 
        className={classes.rightBorder} 
        draggable="true" 
        onDragEnd={this.onDragEnd} 
        onDragStart={this.onDragStart} 
        onDrag={this.onDrag}></div>
    

*/
