import React, { PureComponent } from 'react'
import SimpleTabs from "./sidebarcontainer"
import classes from "./sidebar.css"

export default class Sidebar extends PureComponent {

    constructor(props) {
        super(props)
        this.minWidth = (300 / window.innerWidth) * 100
        this.state = { width: 25, dx: 0 } 

        
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
        this.startX = event.clientX
    }

    onMouseUp = (event) => {
        const { dx, width } = this.state
        this.mouseDown = false
        this.setState({width: dx + width > this.minWidth ? dx + width : this.minWidth, dx: 0})
    }

    onMouseMove = (e) => {
        if( this.mouseDown ) {
            const percChange = 100 * (e.clientX  - this.startX) / window.innerWidth
            this.setState({dx: percChange})
        }
    }

    render() {
        const resizeStyle={height: "100%", width: 6, backgroundColor: "gray", cursor: "col-resize"} 
        const { dx, width } = this.state
        return ( 
            <div className={classes.wrapper} style={{width: width + dx + "%"}}>
                
                <SimpleTabs className={classes.tabs}></SimpleTabs>
                <div onMouseDown={this.onMouseDown} style={resizeStyle}></div>
            </div>
        )
    }
}