import React, { PureComponent } from 'react'
import Draggable from 'react-draggable'

import { editItem, selectItem } from '../../redux/actions/items'

const colors = ["green", "red", "brown", "blue"]

const style = {}

export default class Clip extends PureComponent {
    constructor(props) {
        super(props)
        
        this.state = {
            position: {x: 0, y: props.top}
        }

        this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    onClick = (e) => {
        e.stopPropagation()
        selectItem(this.props.item)
    }

    onStop = (e, b) => {
        if(this.props.item.start.value !== b.x)
            editItem({key: "start", value: b.x / this.props.zoomWidth})
    }

    componentWillReceiveProps(props) {
        if(this.state.position.x  !== props.start * props.zoomWidth){
            this.setState({position: {x: props.start * props.zoomWidth, y: props.top}})
        }
    }

    render() {
        const { width, height, top, item } = this.props
        return (
            <div onClick={this.onClick}>
            <Draggable axis="x" onClick={this.onClick} onStop={this.onStop}  bounds={{left: 0}} position={this.state.position}>
                <div style={{width, height, backgroundColor:this.color, overflow:"hidden", position:"absolute", top, borderRadius: "2px", borderWidth: 0.5,borderColor: '#d6d7da'} }  >
                    {item.name.value}
                </div>
            </Draggable>
            </div>
        )
    }
}