import React, { PureComponent } from 'react'

import { editAutomationPoint } from '../../redux/actions/items'
import { setTime } from '../../redux/actions/globals'


export default class KeyFrame extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            position: {x: props.left, y: props.top},
            resizing: false,
            dx: 0
        }
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
        //selectItem(this.props.item.id)
        this.mouseDown = true
        this.startX = e.clientX
    }

    onMouseUp = (e) => {
        if(this.mouseDown) {
            this.mouseDown = false
            const { item, itemRightOffset } = this.props
            this.endX = e.clientX

            if(item.time + (this.endX  - this.startX) / itemRightOffset >= 0) {
                editAutomationPoint({id: item.id, key: this.props.keyVal, time: item.time + (this.endX-this.startX) / itemRightOffset, value: item.value})
            }else {
                //editItem({key: "start", value: 0 })
            }
            this.setState({dx: 0})
            this.startX = this.endX = 0
        }
    }

    onMouseMove = (e) => {
        if( this.mouseDown) {
            const { item, itemRightOffset, left } = this.props
            if(item.time + (e.clientX  - this.startX) / itemRightOffset >= 0) {
                this.setState({dx: e.clientX  - this.startX})
            }else {
                this.setState({dx: -left})
            } 
        }
    }


    onClick = (e) => {
        setTime(this.props.item.time)
    }

    onStop = (e, b) => {
        if(this.props.item.time !== b.x) {
            //editItem({key: "start", value: b.x / ( this.props.zoomWidth * this.props.unitSize)})
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
        const { top, item, zoomWidth, unitSize } = props

        if(this.state.position.x  !== item.time * zoomWidth * unitSize){
            this.setState({position: {x: Math.floor(item.time * zoomWidth * unitSize), y: top} })
        }
    }

    render() {    
        const { top, left, time, item } = this.props
        let l = left + this.state.dx 

        const borderWidth = time === item.time ? "1px" : "0px"
        const radius =  10
        return (
            <div 
                onClick={this.onClick}
                style={{position:"relative", zIndex: 2}} 
                onMouseDown={this.onMouseDown}
            >
                <div 
                    style={{
                        position: "absolute",
                        width: radius, 
                        height: radius,
                        top:top, 
                        transform: "translateY(125%) translateX(-55%)",
                        left: l,
                        backgroundColor: "red", 
                        boxSizing: "border-box",
                        display: "inline-block",
                        borderRadius: "50%", 
                        border: borderWidth + " solid white"
                    }}>

                </div>
            </div>
        )
    }
}
