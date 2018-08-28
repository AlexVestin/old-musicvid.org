import React from 'react'
import { setSidebarWindowIndex } from '@redux/actions/items' 
import classes from './withheader.css'

export default function withHeader(InputComponent) {
    return class extends React.Component {
        back = () => {
            setSidebarWindowIndex(this.props.idxs.LAYERS)
        }

        layersClicked = () => {
            if(this.props.idx !== this.props.idxs.LAYERS)
                setSidebarWindowIndex(this.props.idxs.LAYERS)
        }

        render() { 
            return(
                <div className={classes.container}>
                <div className={classes.bar}>
                    {(this.props.idx > 2 || this.props.idx === 0) &&
                        <div className={classes.textWrapper} >
                            <div onClick={this.layersClicked} className={classes.txt} style={{marginLeft: 10}}>Layers</div>
                            <div style={{marginLeft: 10, marginRight: 10}}>{"|"}</div>
                            <div className={classes.txt} >Effects</div>
                        </div>
                    }
                </div>

                <InputComponent {...this.props}></InputComponent>
            </div>
        )}
    }
}