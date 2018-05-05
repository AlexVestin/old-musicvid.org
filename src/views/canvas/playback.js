import React, {PureComponent} from 'react'
import Button from 'material-ui/Button'

export default class PlaybackPanel extends PureComponent {

    convertTime = (sec) => {
        var min = Math.floor(sec/60);
        (min >= 1) ? sec = sec - (min*60) : min = '00';
        (sec < 1) ? sec='00' : void 0;

        (min.toString().length == 1) ? min = '0'+min : void 0;    
        (sec.toString().length == 1) ? sec = '0'+sec : void 0;    
        return min+':'+sec;
    }
    render() {
        return(
            <div style={{display: "flex", flexDirection: "column", backgroundColor: "c3c3c3"}}>
                <svg viewBox= {"0 0 "+String(this.props.width) +" 20"} xmlns="http://www.w3.org/2000/svg" style={{height: 20}}>
                    <line x1="0" y1="10" x2={String((this.props.time/180) * this.props.width)} y2="10" stroke="black" />
                </svg>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{position: "absolute", margin: 8}}>
                        {this.convertTime(this.props.time).substring(0, 7)}
                    </div>
                    <div style={{marginLeft: 85}}>
                        <Button disabled={this.props.disabled} onClick={this.props.play}>{this.props.playing ? "Pause" : "Play"}</Button> 
                        <Button disabled={this.props.disabled} onClick={this.props.stop}>Stop</Button>      
                    </div>    

                <Button 
                    onClick={this.props.encode} 
                    variant="raised" 
                    color="secondary"
                    style={{minHeight: "30px", height:"30px", marginLeft: "auto"}}
                    disabled={!true}
                >
                    Export Video
                </Button>
                </div>        
            </div>

        )
    }
}

//disabled={!this.props.encoderLoaded || this.props.encoding || this.props.streamClosed}