import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import classes from './automations.css'
import { connect } from 'react-redux'
import uuid from 'uuid/v1'
import Point from './point'
const automationTypes = ["Points", "Sin", "Cos"]

class Automation extends PureComponent {

    edit = (key, value) => {
        dispatchAction({ type: "EDIT_AUTOMATION", payload: { id: this.props.item.id, key, value } })
    }

    back = () => {
        dispatchAction({ type: "SET_AUTOMATION_IDX", payload: 0 })
    }

    addPoint = () => {
        dispatchAction({ type: "ADD_AUTOMATION_POINT", payload: { id: this.props.item.id, time: this.props.time, pointId: uuid() } })
    }

    removePoint = (id) => {
        dispatchAction({ type: "REMOVE_AUTOMATION_POINT", payload: { pointId: id, id: this.props.item.id } })
    }

    editName = (e) => {
        this.edit("name", e.target.value)
    }

    render() {
        const item = this.props.item;
        return (
            <div>
                <button onClick={this.back}>Back</button>
                <div className={classes.nameWrapper}>
                    Automation Name:
                    <input value={item.name} onChange={this.editName}></input>
                </div>

                <div className={classes.nameWrapper}>
                    Automation Type:
                    <select value={item.type} onChange={(e) => this.edit("type", e.target.value)}>
                        {automationTypes.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>

                {item.type === "Sin" || item.type === "Cos" ?
                    <div>
                        <div className={classes.nameWrapper}>
                            Amplitude:
                            <input value={item.amplitude} onChange={(e) => this.edit("amplitude", e.target.value)}></input>
                        </div>

                         <div className={classes.nameWrapper}>
                            Speed:
                            <input type="" value={item.speed} onChange={(e) => this.edit("speed", e.target.value)}></input>
                        </div>

                        <div className={classes.nameWrapper}>
                            Constant:
                            <input type="" value={item.constant} onChange={(e) => this.edit("constant", e.target.value)}></input>
                        </div>
                    </div>

                    :
                    <div className={classes.pointListContainer}>
                        <div className={classes.pointListHeader}>
                            points
                            <button onClick={this.addPoint} className={classes.addPointButton}>Add point</button>
                        </div>
                        <div className={classes.pointList}>
                            {item.points.map((p, i) => {
                                return (
                                    <Point point={p} item={item} removePoint={this.removePoint} index={i}></Point>
                                )
                            })}
                        </div>
                    </div>

                }


            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        time: state.globals.time
    }
}



export default connect(mapStateToProps)(Automation)
