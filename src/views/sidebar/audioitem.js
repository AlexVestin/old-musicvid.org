

import React, {PureComponent} from 'react'
import ConfigList from './input'
import { removeSound, setSidebarWindowIndex } from '../../redux/actions/items'
import Button from 'material-ui/Button'

export default class AudioItem extends PureComponent {

    removeSound = () => {

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