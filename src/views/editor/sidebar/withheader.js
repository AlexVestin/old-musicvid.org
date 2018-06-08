import React from 'react'
import { setSidebarWindowIndex } from '@redux/actions/items' 

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import AppBar from 'material-ui/AppBar'
import classes from './withheader.css'

const  root = {
    height: "100%", // height of the header/appbar
    width: '100%',
    overflowY : "scroll"
}


export default function withHeader(InputComponent) {
    return class extends React.Component {
        back = () => {
            setSidebarWindowIndex(this.props.backIdx)
        }

        layerClicked = () => {
            if(this.props.idx !== this.props.idxs.LAYER)
                setSidebarWindowIndex(this.props.idxs.LAYER)
        } 

        render() { 

            const style = { backgroundColor: "#676767", height: 30, minHeight: 30, width: "100%", margin: 0}
            return(
            <div style={root}>
                <AppBar position="static" style={style}>
                    {this.props.idx >= 2 &&
                        <div style={{display: "flex", flexDirection: "row", marginTop: 3}}>
                            <div style={{ minWidth: 20, minHeight: 20}}>
                                <KeyboardArrowLeft onClick={this.back} className={classes.icon} ></KeyboardArrowLeft>
                            </div>
                            
                            {this.props.layerName && <div onClick={this.layerClicked} className={classes.txt}>{this.props.layerName}</div>}
                            {this.props.itemName && <div style={{marginLeft: 10}} className={classes.txt}>{" - "}</div>}
                            {this.props.itemName && <div style={{marginLeft: 10}} className={classes.txt}>{this.props.itemName}</div>}
                            
                        </div>
                    }
                </AppBar>

                <InputComponent {...this.props}></InputComponent>
            </div>
        )}
    }
}