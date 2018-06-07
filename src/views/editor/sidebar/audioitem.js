

import React, {PureComponent} from 'react'
import ConfigList from './input'
import { removeSound } from '@redux/actions/items'

export default class AudioItem extends PureComponent {

    removeSound = () => {
        removeSound(this.props.item.id)
    }

    render() {

        const {item} = this.props
        return(
            <React.Fragment>
                <div style={{width: "100%"}}>
            
                <ConfigList 
                    handleChange={() => {}} 
                    defaultConfig={item.defaultConfig} 
                    item={item} 
                    onDelete={this.removeSound} 
                    addAutomation={() => {}}
                    onBack={this.props.onBack}>
                </ConfigList>
            </div>
        </React.Fragment>
        )
    }
} 