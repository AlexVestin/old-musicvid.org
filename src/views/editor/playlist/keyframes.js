import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import KeyFrame from './keyframe'

import { addAutomationPoint, editAutomationPoint, editItem } from '@redux/actions/items'


class KeyframeTracks extends PureComponent {


    addKeyFrame = (automation) => {
        const { item, time } = this.props
        let id = Math.floor(Math.random() * 10000000)
        addAutomationPoint({automationId: automation.id, key: automation.name, point: {time, value: item[automation.name], id}})
    }

    editAutomationPoint = (value, key, time, automation) => {
        let point = automation.points.find(e => e.time === time) 
        if(point) {
            editItem({key, value})
            editAutomationPoint({key, time, value, id: point.id})
        }else {
            this.addKeyFrame(automation)
        }
    }

    render() {
        const { automations, pHeight, zoomHeight, zoomWidth, itemRightOffset, unitSize, left } = this.props

        return(
            <React.Fragment>
                {automations && automations.map( (automation, i) => 
                    automation.points.map(point => 
                    <KeyFrame
                        time={this.props.time}
                        key={point.time} 
                        keyVal={automation.name}
                        top={(i+1) * pHeight}
                        height={pHeight * zoomHeight}
                        left={  (point.time * itemRightOffset) - left}
                        zoomWidth={zoomWidth}
                        item={point}
                        itemRightOffset={itemRightOffset}
                        unitSize={unitSize}
                    >
                    </KeyFrame>

                ))}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        time: state.globals.time
    }
}

export default connect(mapStateToProps)(KeyframeTracks)