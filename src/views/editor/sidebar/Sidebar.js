import React, { PureComponent } from 'react'
import {connect } from 'react-redux'
import classes from "./sidebar.css"
import Audio from './views/audio/audio'
import Automations from './views/automations/automations'
import LayerList from './views/layer/layers'
import ProjectSettings from './views/settings/projectsettings'
import LayerContainer from './views/layer/layercontainer'
import indices from './indices'

const resizeStyle={height: "100%", width: 6, backgroundColor: "gray", cursor: "col-resize"} 
class Sidebar extends PureComponent {

    constructor(props) {
        super(props)
        this.minWidth = (400 / window.innerWidth) * 100
        this.state = { width: 30, dx: 0 } 
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
        this.minWidth = (400 / window.innerWidth) * 100
    }

    onMouseMove = (e) => {
        if( this.mouseDown ) {
            const percChange = 100 * (e.clientX  - this.startX) / window.innerWidth
            this.setState({dx: percChange})
        }
    }

    

    render() {
        
        const { dx, width } = this.state
        const value = this.props.sideBarWindowIndex

        return ( 
            <div className={classes.wrapper} style={{width: width + dx + "%"}}>
                
                <div className={classes.root}>
                    {value === indices.PROJECTSETTINGS && <ProjectSettings idxs={indices} idx={2}></ProjectSettings>}
                    {value === indices.LAYERS && <LayerList idx={0} idxs={indices} ></LayerList>}
                    {value === indices.AUDIO && <Audio idxs={indices} idx={indices.AUDIO}></Audio>}
                    {value === indices.AUTOMATIONS && <Automations idxs={indices} idx={indices.AUTOMATIONS}></Automations>}
                    {value >= 4 && <LayerContainer idxs={indices} ></LayerContainer>}
                </div>
                <div onMouseDown={this.onMouseDown} style={resizeStyle}></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedItemId: state.items.selectedItemId,
        sideBarWindowIndex: state.items.sideBarWindowIndex,
        selectedLayerId: state.items.selectedLayerId,      
    }
}

export default connect(mapStateToProps)(Sidebar);