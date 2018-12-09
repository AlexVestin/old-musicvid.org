import React, { PureComponent } from 'react'
import  {connect } from 'react-redux'
import { dispatchAction } from '@redux/actions/items'
import Automation from './item'
import classes from './automations.css'
import uuid from 'uuid/v1'

class Automations extends PureComponent {

    addAutomation = () => {
        dispatchAction({type: "ADD_AUTOMATION", payload: {id: uuid()}})
    }

    setListView = () => {
        dispatchAction({type: "SET_AUTOMATION_IDX", payload: 0})
    }

    selectAutomation = (id) => {
        dispatchAction({type: "SET_SELECTED_AUTOMATION", payload: id})
    }

    render() {
        let item =  null;
        if(this.props.automations) {
            item = this.props.automations[this.props.selectedAutomation]
        }
        return(
            <div>
                {this.props.automationIdx === 0 ?
                    <div className={classes.listContainer}> 
                        <div className={classes.header}>
                            <button onClick={this.addAutomation}> ADD NEW AUTOMATION</button>

                        </div>

                        <div className={classes.list}>
                            {Object.keys(this.props.automations).map(key => {
                                let obj = this.props.automations[key] 
                                return(
                                    <div onClick={() => this.selectAutomation(obj.id)} className={classes.listItem} key={obj.id}>{obj.name} </div>
                                )
                            })}
                        </div>
                    </div>
                :
                <Automation item={item}>
                   
                </Automation>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        automations: state.items.automations,
        automationIdx: state.items.automationIdx,
        selectedAutomation: state.items.selectedAutomation
    }
}

export default connect(mapStateToProps)(Automations)
