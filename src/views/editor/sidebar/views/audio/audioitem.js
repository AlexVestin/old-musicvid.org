

import React, {PureComponent} from 'react'
import ConfigList from '../../input/input'
import { removeSound, editAudio } from '@redux/actions/items'
import NameInput from '../layer/nameinput'

export default class AudioItem extends PureComponent {
    removeSound = () => {
        removeSound(this.props.item.id)
    }

    editName = event => {
        editAudio({key: "name", value: event.target.value})
    }


    render() {

        const {item} = this.props
        return(
            <React.Fragment>
                <div style={{width: "100%"}}>

                    <NameInput value={item.name} edit={this.editName} onDelete={this.removeSound}></NameInput>
                
                    <ConfigList 
                        edit={editAudio} 
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