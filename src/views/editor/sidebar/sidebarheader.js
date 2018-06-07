import React, { PureComponent } from "react";
import {setSidebarWindowIndex} from '@redux/actions/items'
import { connect } from 'react-redux'
import classes from './sidebarheader.css'
import Button from 'material-ui/Button'

 class SidebarHeader extends PureComponent {
    
    handleChange = (event, value) => {
        
        setSidebarWindowIndex(value)
    };

    render() {
        const idx = this.props.idx
        return(
           <div className={classes.container}>
                <div className={classes.tab_container}>
                    <Tab idx={0} selectedIdx={idx} label="Layers"></Tab>
                    <Tab idx={1} selectedIdx={idx} label="Audio"></Tab>
                    <Tab idx={2} selectedIdx={idx} label="Settings"></Tab>
                </div>
           </div>
        )
    }
}

const Tab = (props) => {
    return (
        <Button 
            style={{backgroundColor: props.idx === props.selectedIdx ? "#999999" : ""}} 
            disableRipple 
            onClick={() => setSidebarWindowIndex(props.idx)} 
            className={classes.tab}>
            {props.label}
        </Button>
    )
}

const mapStateToProps = state => {
    return {
        idx: state.items.sideBarWindowIndex
    }
}

export default connect(mapStateToProps)(SidebarHeader)