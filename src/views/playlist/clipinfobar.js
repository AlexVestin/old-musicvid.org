import React, { PureComponent } from 'react'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import classes from './clipinfobar'
import Clip from './clip'
import Button from 'material-ui/Button'

export default class ClipInfoBar extends PureComponent {

    render(){
        const items = this.props.items
        return (
                <div style={{width: "100%"}}>
                    <div style={{position: "absolute", width: "13%", height: "100%", backgroundColor: "#434343"}}></div>
                    {items.map((e,i ) => 
                        <ClipItem key={i} info={this.props.info} item={e} index={i}></ClipItem>
                    )}
                </div>
            
        )
    }
}


const clipStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    fontSize: 10,
    color: "#D9D9D9",
    borderBottom: "1px solid gray"
}


class ClipItem extends PureComponent {
    state = {expanded: false}

    render(){
        const item = this.props.item
        if(!item) return null
        var str = item.name.length  < 30 ? item.name : item.name.substring(0, 30) + "..."

        const i = this.props.index
        const panelHeight = this.state.expanded ? 120 :  30;

        const {viewport, unitSize, zoomWidth, zoomHeight, width, height, rOffset, maxNrUnits } = this.props.info
        const { start, duration } = item
        const right = viewport[2] * maxNrUnits*unitSize * zoomWidth
        const left = viewport[0] * maxNrUnits*unitSize * zoomWidth
        const shouldDrawClip = ((start * rOffset) < right || (start + duration) * rOffset >= left)

        console.log(i)
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", height: panelHeight}}>
                <div style={{width: "13%", zIndex: 3, backgroundColor: "#434343", overflow: "hidden"}} >
                    <div key={i} style={{...clipStyle, height: panelHeight}}>
                        <div >
                            <div style={{marginLeft: 3, position: "absolute"}}>
                                {i + 1}
                            </div>
                            <div style={{marginTop: 2, marginLeft: 15, color: "white", fontSize: 10, display: "flex", flexDirection: "row"}}>
                                {!this.state.expanded && <KeyboardArrowDown onClick={() => this.setState({expanded: true})} style={{marginTop: -5}}/>}
                                {this.state.expanded && <KeyboardArrowUp onClick={() => this.setState({expanded: false})} style={{marginTop: -5}}/>}
                                {str}
                            </div>
                        </div>
                        <div style={{marginTop: 5}}>

                        </div>
                    </div>
                </div>

                {shouldDrawClip &&
                <div style={{height: panelHeight}}>
                    <Clip 
                        key={item.id} 
                        height={30 * zoomHeight}
                        left={ (start * rOffset) - left}
                        zoomWidth={zoomWidth}
                        item={item}
                        rOffset={rOffset}
                        unitSize={unitSize}
                        >
                    </Clip>
                </div>
                    
            }
            </div>
        )
    }
}


