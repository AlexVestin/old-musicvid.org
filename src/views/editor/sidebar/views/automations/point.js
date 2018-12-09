import React, { PureComponent } from "react";
import classes from './automations.css'
import { dispatchAction } from '@redux/actions/items'


export default class Point extends PureComponent {

    edit = (key, value) => {
        dispatchAction({type: "EDIT_AUTOMATION_POINT", payload: {id: this.props.item.id, pointId: this.props.point.id, key, value}})
    }

    render() {
        const point = this.props.point;
        return(
            
            <div className={classes.pointContainer}>
                <div className={classes.pointHeader}>
                    {this.props.index} 
                    <button onClick={() => this.props.removePoint(point.id)}>Remove</button>
                </div>

                <div className={classes.point}>
                    <div className={classes.inputWrapper}> Time:<input onChange={(e) => this.edit("time", e.target.value)} value={point.time}></input></div>
                    <div className={classes.inputWrapper}> Value:<input onChange={(e) => this.edit("value", e.target.value)} value={point.value}></input></div>
                </div>

        </div>
        )
    }
}