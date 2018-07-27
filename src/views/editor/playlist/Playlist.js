import React, { PureComponent } from 'react'
import SimpleTabs from './tabs'

export default class Playlist extends PureComponent {

    constructor(props) {
        super(props)
        this.state = { height: 32, dy: 0 }
        
        this.minHeightPx = 200
        this.maxHeightPx = 500
        this.minHeight = (this.minHeightPx / window.innerHeight) * 100
        this.maxheight = (this.maxHeightPx / window.innerHeight) * 100
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.onMouseUp)
        window.removeEventListener("mousemove", this.onMouseMove)
        
    }
    componentDidMount() {
        window.addEventListener("mouseup", this.onMouseUp)
        window.addEventListener("mousemove", this.onMouseMove)
    }

    onMouseDown = (event) => {
        event.preventDefault()
        this.mouseDown = true
        this.startY = event.clientY
    }

    onMouseUp = (event) => {
        const { dy, height } = this.state
        this.mouseDown = false

        let h =  dy + height
        h = h > this.maxheight ? this.maxheight : h
        h = h < this.minHeight ? this.minHeight : h
        this.setState({height: h, dy: 0})
    }

    onMouseMove = (e) => {
        if( this.mouseDown ) {
            const percChange = -100 * (e.clientY  - this.startY) / window.innerHeight
            this.setState({dy: percChange})
        }
    }

    render() {
        const { dy, height } = this.state
        const resizeStyle={width: "100%", height: 6, backgroundColor: "gray", cursor: "row-resize"} 

        return (
            <div draggable="false" style={{position: "relative", height: height + dy + "%", width: "100%", minHeight: this.minHeightPx, maxHeight: this.maxHeightPx}}>
                <div onSelectCapture={() => false} draggable="false" style={resizeStyle} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}></div>
                <SimpleTabs></SimpleTabs>
            </div>
        )
    }
}