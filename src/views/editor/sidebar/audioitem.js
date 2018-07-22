

import React, {PureComponent} from 'react'
import ConfigList from './input'
import { removeSound } from '@redux/actions/items'

import Delete  from '@material-ui/icons/Delete'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import AppBar from 'material-ui/AppBar'
export default class AudioItem extends PureComponent {
    removeSound = () => {
        removeSound(this.props.item.id)
    }

    render() {

        const {item} = this.props
        return(
            <React.Fragment>
                <div style={{width: "100%"}}>

                
                <AppBar position="static" style={{display: "flex" , flexDirection: "row", backgroundColor: "#676767", height: 30, minHeight: 30, width: "100%", margin: 0, textAlign: "center"}}>
                    <div style={{minWidth: 20, minHeight: 20, marginTop: 3}}>
                        <KeyboardArrowLeft onClick={this.props.onBack} ></KeyboardArrowLeft>
                    </div>
                    <div style={{marginTop: 3, height: 12}}>{item.name} </div>
                </AppBar>
                <div style={{height: 28, width: "100%", display:"flex", flexDirection: "row", justifyContent: "flex-end", backgroundColor: "#AAA"}}> 
                      <div style={{color:"#F50057", minWidth: 10, minHeight: 10 }}>
                          <Delete onClick={this.removeSound}  style={{cursor: "pointer"}}></Delete>
                      </div>
                  </div>
            
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