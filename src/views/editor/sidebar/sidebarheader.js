import React, { Component } from "react";
import {setSidebarWindowIndex} from '@redux/actions/items'
import { connect } from 'react-redux'
import classes from './sidebarheader.css'
import Button from 'material-ui/Button'


import CollectionsIcon from '@material-ui/icons/Collections'
import AudioTrack from '@material-ui/icons/Audiotrack'
import Settings from '@material-ui/icons/Settings'




class SidebarHeader extends Component {
    
    handleChange = (event, value) => {        
        setSidebarWindowIndex(value)
    };

    shouldComponentUpdate(props) {

        return props.idx <= 2 || props.idx === 5
    }

    render() {
        const idx = this.props.idx
        

        return(
           <div className={classes.container}>
                <div className={classes.tab_container}>
                    <Tab idx={0} selectedIdx={idx !== 5 ? idx : 0}><CollectionsIcon></CollectionsIcon></Tab>
                    <Tab idx={1} selectedIdx={idx !== 5 ? idx : 0}><AudioTrack></AudioTrack></Tab>
                    <Tab idx={2} selectedIdx={idx !== 5 ? idx : 0}><Settings></Settings></Tab>
                </div>
           </div>
        )
    }
}

const Tab = (props) => {
    return (
        <div 
            style={{backgroundColor: props.idx === props.selectedIdx ? "#676767" : "", color: props.idx === props.selectedIdx ? "#ccc" : ""}} 
            disableRipple 
            onClick={() => setSidebarWindowIndex(props.idx)} 
            disabled={props.disabled}
            className={classes.tab}>
            {props.children}

        </div>
    )
}

const mapStateToProps = state => {
    return {
        idx: state.items.sideBarWindowIndex
    }
}

export default connect(mapStateToProps)(SidebarHeader)