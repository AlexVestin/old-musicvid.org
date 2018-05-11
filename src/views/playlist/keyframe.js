import React, { PureComponent } from 'react'


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
        if(this.props.item.movable) {
            //selectItem(this.props.item)
            this.mouseDown = true
            this.startX = e.clientX
        }
    }

    onMouseUp = (e) => {
        this.mouseDown = false
        const { item, rOffset } = this.props
        this.endX = e.clientX

        if(item.start + (this.endX  - this.startX) / rOffset >= 0) {
            //editItem({key: "start", value: item.start + (this.endX-this.startX) / rOffset })
        }else {
            //editItem({key: "start", value: 0 })
        }
            
        this.setState({dx: 0})
        this.startX = this.endX = 0
    }

    onMouseMove = (e) => {
        if( this.mouseDown) {
            const { item, rOffset, left } = this.props
            if(item.start + (e.clientX  - this.startX) / rOffset >= 0) {
                this.setState({dx: e.clientX  - this.startX})
            }else {
                this.setState({dx: -left})
            } 
        }
    }


    onClick = (e) => {
        console.log("keyframe clicked")
    }

    onStop = (e, b) => {
        if(this.props.item.movable) {
            if(this.props.item.start !== b.x) {
                //editItem({key: "start", value: b.x / ( this.props.zoomWidth * this.props.unitSize)})
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
        const { top, item, zoomWidth, unitSize } = props

        if(this.state.position.x  !== item.start * zoomWidth * unitSize){
            this.setState({position: {x: Math.floor(item.start * zoomWidth * unitSize), y: top} })
        }
    }

    render() {    
        const { height, top, left } = this.props
        let l = left + this.state.dx 

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
                        width: 2, 
                        top:top, 
                        height: height, 
                        left: l,
                        backgroundColor:"red", 
                        border: "solid",
                        boxSizing: "border-box",
                        borderRadius: "0.12rem", 
                        borderWidth: 1,
                        borderColor: '#555555'
                    }}>

                </div>
            </div>
        )
    }
}
