import React, { PureComponent } from 'react'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import AddBox from '@material-ui/icons/AddBox'

import classes from './groupcontainer.css'

const groupContainerStyle = {
    width: "100%",       
    overflow: "hidden",
    borderBottom: "1px solid #b2b2b2",
    transition: "height 1s ease-in-out",
    minHeight: 0,
}

class GroupContainer extends PureComponent {
    state = {expanded: false}

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})
    
    addAction = (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.props.addAction()
    }

    render() {
        const addAction = this.props.addAction ?  this.addAction : undefined

        return(
            <div key={this.props.label} style={groupContainerStyle} className={classes.container}>
                <div>
                    <GroupHeader addAction={addAction} expanded={this.state.expanded} label={this.props.label} toggleExpanded={this.toggleExpanded}></GroupHeader>
                    {this.state.expanded && this.props.children}
                 </div>
            </div>  
        )
    }
}

const GroupHeader = (props) => {
    const iconSize = 20
    return(
        <div style={{backgroundColor: "#eee", display: "flex", flexDirection: "row", justifyContent:"space-between"}} onClick={props.toggleExpanded}>
        <p style={{ height: 20, margin: 5, fontSize: 16}}>{props.label} </p>
        <div style={{display: "flex", flexDirection: "row"}}>
            { props.addAction && 
                <div style={{minWidth: iconSize, minHeight: iconSize, marginTop: 3}}>
                    <AddBox onClick={props.addAction} style={{marginTop: 3, width: iconSize, height: iconSize}}></AddBox>
                </div>
            }
            { props.expanded && 
            <div style={{minWidth: iconSize, minHeight: iconSize, marginTop: 3}}>
                <KeyboardArrowUp></KeyboardArrowUp>
            </div>}
            { !props.expanded &&
            <div style={{minWidth: iconSize, minHeight: iconSize, marginTop: 3}}>
                <KeyboardArrowDown ></KeyboardArrowDown>
            </div>
            }
        </div>
    </div>
    )
}

export default GroupContainer