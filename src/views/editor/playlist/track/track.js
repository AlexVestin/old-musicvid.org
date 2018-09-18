import React, {PureComponent} from 'react'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import classes from './clipinfobar.css'
import Clip from './clip'
import { editItem, editAudio, selectItem, selectAudio } from '@redux/actions/items'
import { connect } from 'react-redux'

const pHeight = 35


const clipStyle = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    color: "#D9D9D9",
    borderBottom: "1px solid gray",
    width: "100%"
}


class ClipItem extends PureComponent {
    state = {expanded: false}


    render(){
        const {viewport, unitSize, zoomWidth, zoomHeight, itemRightOffset, maxNrUnits } = this.props.info
        const item = this.props.item
        
        let panelHeight = pHeight;
        let i = this.props.index;
        let shouldDrawClip = false, start = 0, left = 0, str = "", duration = 0;

        console.log(item)

        if(item !== null && item !== undefined) {
            const layer = this.props.layers[this.props.item.sceneId]
            str = item.name.length  < 30 ? item.name : item.name.substring(0, 30) + "..."
            if(layer)str += "  [" + layer.name + "]"
    
            panelHeight = this.state.expanded ? pHeight * (item.automations.length + 1) :  pHeight;
    
           
            start = item.start
            duration = item.duration
            const right = viewport[2] * maxNrUnits * unitSize * zoomWidth
            left  = viewport[0] * maxNrUnits * unitSize * zoomWidth
            shouldDrawClip = ((start * itemRightOffset) < right || (start + duration) * itemRightOffset >= left)
        }


        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", height: panelHeight}}>
                <div style={{borderBottom: "1px solid rgba(0,0,0,0.19)", borderRight: "2px solid rgba(0,0,0,0.49)", width: "20%", zIndex: 3, backgroundColor: "#434343", overflow: "hidden", boxSizing: "border-box"}} >
                    <div key={i} style={{...clipStyle, height: panelHeight}}>
                        <div style={{width: "100%"}}>
                            <div className={classes.txt} style={{marginLeft: 3, position: "absolute"}}>{i + 1}.</div>
                            
                            <div style={{marginTop: 2, marginLeft: 15, color: "white", fontSize: 14, display: "flex", flexDirection: "row", height: pHeight}}>
                                
                                {item &&
                                    <React.Fragment>
                                        {!this.state.expanded &&  
                                        <div style={{minWidth: 15, height: 15, color: "white"}}>
                                            <KeyboardArrowDown  onClick={() => this.setState({expanded: true})} style={{marginTop: -5}}> </KeyboardArrowDown>
                                        </div>
                                        }
                                        {this.state.expanded && 
                                        <div style={{minWidth: 15, minHeight: 15,  color: "white"}}>
                                            <KeyboardArrowUp  onClick={() => this.setState({expanded: false})} style={{marginTop: -5}} ></KeyboardArrowUp>        
                                        </div>
                                        }
                                    </React.Fragment>
                                }
                               
                                <div className={classes.txt} >{str}</div>
                            </div>
                        </div>
                    </div>
                   
                </div>

                {(shouldDrawClip && item) &&
                    <div style={{height: panelHeight}} draggable="false">
                        
                        <Clip 
                            selectItem={item.type === "SOUND" ? selectAudio : selectItem}
                            edit={item.type === "SOUND" ? editAudio : editItem}
                            key={item.id} 
                            height={pHeight * zoomHeight}
                            left={ (start * itemRightOffset) - left}
                            zoomWidth={zoomWidth}
                            item={item}
                            itemRightOffset={itemRightOffset}
                            unitSize={unitSize}
                            viewport={viewport}
                            maxNrUnits={maxNrUnits}
                        >
                        </Clip>
                        
                    </div>    
                }

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        fps: state.globals.fps,
        selectedItemId:  state.items.selectedItemId,
        layers: state.items.layers
    }
}

export default connect(mapStateToProps)(ClipItem)
