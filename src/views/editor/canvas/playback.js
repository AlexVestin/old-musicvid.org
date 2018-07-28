import React, {PureComponent} from 'react'
import Button from 'material-ui/Button'

import { connect } from 'react-redux'

class PlaybackPanel extends PureComponent {

    convertTime = (sec) => {
        var min = Math.floor(sec/60);
        (min >= 1) ? sec = sec - (min*60) : min = '00';
        
        sec = sec < 10 ? "0" + sec : sec;

        (min.toString().length === 1) ? min = '0'+min : void 0;    
        (sec.toString().length === 1) ? sec = '0'+sec : void 0;    
        return min+':'+sec;
    }
    render() {

        console.log("width???", this.props.width)
        return(
            <div style={{display: "flex", flexDirection: "column", maxWidth: this.props.width}}>
                <svg viewBox= {"0 0 "+String(this.props.width) +" 20"} xmlns="http://www.w3.org/2000/svg" style={{height: 20}}>
                    <line x1="0" y1="10" x2={String((this.props.time / this.props.clipDuration) * this.props.width)} y2="10" stroke="black" />
                </svg>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{position: "absolute", margin: 8, userSelect: "none"}}>
                        {this.convertTime(this.props.time).substring(0, 8)}
                    </div>
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
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        clipDuration: state.globals.clipDuration
    }
}

export default connect(mapStateToProps)(PlaybackPanel)

//disabled={!this.props.encoderLoaded || this.props.encoding || this.props.streamClosed}