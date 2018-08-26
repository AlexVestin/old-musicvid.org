

import React, {PureComponent} from 'react'
import Button from 'material-ui/Button'

export default class ButtonGroup extends PureComponent  {

    render() {
        return(
            <div style={{display: "flex", flexDirection: "row"}}>
                
                <div style={{marginLeft: 85}}>
                    
                    <Button disabled={this.props.disabled} onClick={this.props.play}>{this.props.playing ? "Pause" : "Play"}</Button> 
                    <Button disabled={this.props.disabled} onClick={this.props.stop}>Stop</Button>      
                </div>    
    
                
        </div>
        )
    }
}
