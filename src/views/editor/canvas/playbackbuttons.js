

import React, {PureComponent} from 'react'
import Button from 'material-ui/Button'

import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import StopIcon from '@material-ui/icons/Stop'

export default class ButtonGroup extends PureComponent  {

    render() {
        return(
            <div style={{display: "flex", flexDirection: "row"}}>
                
                <div style={{marginLeft: 85}}>
                    
                    <Button disabled={this.props.disabled} onClick={this.props.play}>{this.props.playing ? "Pause" : "Play"}</Button> 
                    <Button disabled={this.props.disabled} onClick={this.props.stop}>Stop</Button>      
                </div>    
    
                <div style={{minHeight: "30px", height:"30px", marginLeft: "auto"}} >
                    <Button 
                        onClick={this.props.encode} 
                        variant="raised" 
                        color="secondary"
                                                    >
                        Export Video
                    </Button>
                </div>
        </div>
        )
    }
}
