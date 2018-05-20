import React, {PureComponent} from 'react'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import Add from '@material-ui/icons/Add'

import classes from './clipinfobar.css'
import Clip from './clip'
import KeyFrame from './keyframe'
import { addAutomationPoint, editAutomationPoint, editItem, editAudio, selectItem, selectAudio } from '../../redux/actions/items'
import { connect } from 'react-redux'

const pHeight = 35


const clipStyle = {
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

    //Expand clip view if automation is added
    componentWillReceiveProps(props) {
        if(props.item.automations.length !== this.props.item.automations.length) {
            this.setState({expanded: true})
        } 
    }

    addKeyFrame = (automation) => {
        const { item, time } = this.props
        let id = Math.floor(Math.random() * 10000000)
        addAutomationPoint({automationId: automation.id, key: automation.name, point: {time, value: item[automation.name], id}})
    }

    editAutomationPoint = (value, key, time, automation) => {
        let point = automation.points.find(e => e.time === time) 
        if(point) {
            editItem({key, value})
            editAutomationPoint({key, time, value, id: point.id})
        }else {
            this.addKeyFrame(automation)
        }
    }

    render(){
        const item = this.props.item
        if(!item) return null

        var str = item.name.length  < 30 ? item.name : item.name.substring(0, 30) + "..."
        if(this.props.selectedLayer)str += "  [" + this.props.selectedLayer.name + "]"

        const i = this.props.index
        const panelHeight = this.state.expanded ? pHeight * (item.automations.length + 1) :  pHeight;

        const {viewport, unitSize, zoomWidth, zoomHeight, itemRightOffset, maxNrUnits } = this.props.info
        const { start, duration } = item
        const right = viewport[2] * maxNrUnits * unitSize * zoomWidth
        const left  = viewport[0] * maxNrUnits * unitSize * zoomWidth
        const shouldDrawClip = ((start * itemRightOffset) < right || (start + duration) * itemRightOffset >= left)


        const automations = this.props.automations[item.id]
        return(
            <div style={{width: "100%", display: "flex", flexDirection: "row", height: panelHeight}}>
                <div style={{borderBottom: "1px solid gray", width: "20%", zIndex: 3, backgroundColor: "#434343", overflow: "hidden"}} >
                    <div key={i} style={{...clipStyle, height: panelHeight}}>
                        <div style={{width: "100%"}}>
                            <div style={{marginLeft: 3, position: "absolute"}}>{i + 1}</div>
                            
                            <div style={{marginTop: 2, marginLeft: 15, color: "white", fontSize: 14, display: "flex", flexDirection: "row", height: pHeight}}>
                                {!this.state.expanded && <KeyboardArrowDown onClick={() => this.setState({expanded: true})} style={{marginTop: -5}}/>}
                                {this.state.expanded && <KeyboardArrowUp onClick={() => this.setState({expanded: false})} style={{marginTop: -5}}/>}
                                <div style={{userSelect: "none"}}>{str}</div>
                            </div>

                             {this.state.expanded && 

                            <React.Fragment>
                                {automations.map((e, i) => (
                                    <div 
                                        key={e.name}
                                        style={{
                                            
                                            boxSizing: "border-box",
                                            justifyContent: "space-between",
                                            borderTop: "1px solid", 
                                            width: "calc(100% - 60px)",
                                            height: pHeight,
                                            marginLeft: 60, 
                                            fontSize: 12, 
                                            textTransform: "uppercase",
                                            display: "flex",
                                            flexDirection: "row"
                                        }}>
                            
                                        <div style={{userSelect: "none", marginTop: 17}}>{e.name}</div>

                                        <div style={{marginRight: 10, marginTop: 2, display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <Add onClick={() =>this.addKeyFrame(e)} style={{color: "white", width: 30, height: 30, minWidth: 30, minHeight: 30}}></Add>
                                            <input 
                                                onChange={(evt) => this.editAutomationPoint(evt.target.value, e.name, this.props.time, e)} 
                                                type="number" 
                                                value={item[e.name]} 
                                                className={classes.keyframeInput}
                                            ></input>
                                        </div>
                                        
                                    </div>
                                ))}
                            </React.Fragment>}
                           
                        </div>
                    </div>
                   
                </div>

                {shouldDrawClip &&
                    <div style={{height: panelHeight}}>
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
                            >
                        </Clip>
                        {this.state.expanded && 
                            <React.Fragment>
                            {automations.map( (automation, i) => 
                                automation.points.map(point => 
                                <KeyFrame
                                    time={this.props.time}
                                    key={point.time} 
                                    keyVal={automation.name}
                                    top={(i+1) * pHeight}
                                    height={pHeight * zoomHeight}
                                    left={  (point.time * itemRightOffset) - left}
                                    zoomWidth={zoomWidth}
                                    item={point}
                                    itemRightOffset={itemRightOffset}
                                    unitSize={unitSize}
                                >
                                </KeyFrame>

                            ))}
                            </React.Fragment>
                        }
                    </div>    
                }


            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        time: state.globals.time,
        fps: state.globals.fps,
        automations: state.items.automations,
        selectedItemId:  state.items.selectedItemId,
        selectedLayer: state.items.layers[ownProps.item.sceneId]
    }
}

export default connect(mapStateToProps)(ClipItem)