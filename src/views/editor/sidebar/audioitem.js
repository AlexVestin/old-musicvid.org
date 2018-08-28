

import React, {PureComponent} from 'react'
import ConfigList from './input/input'
import { removeSound, editAudio } from '@redux/actions/items'
import Delete  from '@material-ui/icons/Delete'

export default class AudioItem extends PureComponent {
    removeSound = () => {
        removeSound(this.props.item.id)
    }

    render() {

        const {item} = this.props
        return(
            <React.Fragment>
                <div style={{width: "100%"}}>

                <div style={{height: 28, overflow: "hidden", width: "100%", display:"flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: "#AAA"}}> 
                      {item.name.substring(0, 40)}
                      <div style={{color:"#F50057", minWidth: 10, minHeight: 10 }}>
                          <Delete onClick={this.removeSound}  style={{cursor: "pointer"}}></Delete>
                      </div>
                  </div>
            
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