import React from 'react'
import { setSidebarWindowIndex } from '@redux/actions/items' 
import classes from './withheader.css'

export default function withHeader(InputComponent) {
    return class extends React.Component {
        back = () => {
            setSidebarWindowIndex(this.props.backIdx)
        }

        layerClicked = () => {
            if(this.props.idx !== this.props.idxs.LAYER)
                setSidebarWindowIndex(this.props.idxs.LAYER)
        } 

        layersClicked = () => {
            if(this.props.idx !== this.props.idxs.LAYERS)
                setSidebarWindowIndex(this.props.idxs.LAYERS)
        }

        onDelete = () => {
            console.log("delete", this.props)
        }

        render() { 
            return(
            <div className={classes.container}>
                <div className={classes.bar}>
                    {(this.props.idx > 2 || this.props.idx === 0) &&
                        <div className={classes.textWrapper} >
                            
                            <div onClick={this.layersClicked} className={classes.txt} style={{marginLeft: 10}}>Layers</div>
                            {this.props.layerName && <div style={{marginLeft: 10,marginRight: 10}}>{"|"}</div>}
                            {this.props.layerName && <div onClick={this.layerClicked} className={classes.txt}>{this.props.layerName}</div>}
                            {this.props.itemName && <div style={{marginLeft: 10, marginRight: 10}}>{"|"}</div>}
                            {this.props.itemName && <div className={classes.txt}>{this.props.itemName}</div>}
                            
                        </div>
                    }
                </div>

                <InputComponent {...this.props}></InputComponent>
            </div>
        )}
    }
}