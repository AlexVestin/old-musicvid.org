import React, { PureComponent } from 'react'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import AddBox from '@material-ui/icons/AddBox'
import classes from './groupcontainer.css'


class GroupContainer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {expanded: props.expanded} 
    } 
    

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})
    
    addAction = (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.props.addAction()
    }

    render() {
        const addAction = this.props.addAction ?  this.addAction : undefined

        return(
            <div key={this.props.label} className={classes.container}>
                <div>
                    <GroupHeader addAction={addAction} expanded={this.state.expanded} label={this.props.label} toggleExpanded={this.toggleExpanded}></GroupHeader>
                    {(this.state.expanded  ) && this.props.children}
                 </div>
            </div>  
        )
    }
}


const GroupHeader = (props) => {

    return(
        <div className={classes.headerWrapper} onClick={props.toggleExpanded}>
            <p style={{ height: 20, margin: 5, fontSize: 16}}>{props.label} </p>
            <div style={{display: "flex", flexDirection: "row"}}>
                { props.addAction && 
                    <div className={classes.iconWrapper}>
                        <AddBox onClick={props.addAction} className={classes.icon} style={{width: 17, height: 17}}></AddBox>
                    </div>
                }
                { props.expanded ? 
                    <div className={classes.iconWrapper}>
                        <KeyboardArrowUp className={classes.icon}></KeyboardArrowUp>
                    </div>
                :
                    <div className={classes.iconWrapper}>
                        <KeyboardArrowDown className={classes.icon} ></KeyboardArrowDown>
                    </div>
                }
            </div>
        </div>
    )
}

export default GroupContainer