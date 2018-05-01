import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'

import { editItem, selectItem } from '../../redux/actions/items'

const colors = ["green", "red", "brown", "blue"]

export default class Clip extends PureComponent {
    constructor(props) {
        super(props)
        console.log(props.left)
        this.state = {
            position: {x: props.left, y: props.top},
            resizing: false,
        }

        console.log("constrcutor")

        this.color = colors[Math.floor(Math.random() * colors.length)]
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

    clipDragged = (e, b) => {
        this.setState({position: {x:b.x / this.props.unitSize, y: this.state.position.y}})
    }

    componentWillReceiveProps(props) {
        console.log("left: ", props.left)
        const { height, top, item, zoomWidth, unitSize } = this.props

        if(this.state.position.x  !== props.item.start * props.zoomWidth * this.props.unitSize){
            this.setState({position: {x: Math.floor(props.item.start * props.zoomWidth * this.props.unitSize), y: props.top} })
        }
    }

    render() {        
        const { height, top, item, zoomWidth, unitSize, left } = this.props
        let w = this.props.item.duration * zoomWidth * unitSize 

        return (
            <div onClick={this.onClick} style={{position:"absolute", display: "flex", flexDirection: "row"}}>
                <div 
                    style={{
                        position: "absolute",
                        width: w, 
                        top:top, 
                        height:height, 
                        left: left,
                        backgroundColor:this.color, 
                        overflow:"hidden", 
                        borderRadius: "2px", 
                        borderWidth: 0.5,
                        borderColor: '#d6d7da'
                    }}>
                    <div style={{fontSize: 12, fontFamily: "'Lucida Console', Monaco, monospace", color:"white", pointerEvents: "none", textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}}>
                        {item.name}
                    </div>
                </div>
            </div>
        )
    }
}
