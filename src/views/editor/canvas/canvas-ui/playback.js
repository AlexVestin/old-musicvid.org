import React, {PureComponent} from 'react'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import PauseIcon from '@material-ui/icons/PauseCircleFilled'
import StopIcon from '@material-ui/icons/Stop'
import classes from './playbackbuttons.css'
import { connect } from 'react-redux'
import { editProjectSettings } from '@redux/actions/globals'



let TimeLine = (props) => {
    return (
        <svg viewBox= {"0 0 "+String(props.width) +" 10"} xmlns="http://www.w3.org/2000/svg" style={{height: 10}}>
            <line x1="0" y1="5" x2={String((props.time / props.clipDuration) * props.width)} y2="5" stroke="black" />
        </svg>
    )
} 

const convertTime = (sec) => {
    var min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = '00';
    
    sec = sec < 10 ? "0" + sec : sec;

    (min.toString().length === 1) ? min = '0'+min : void 0;    
    (sec.toString().length === 1) ? sec = '0'+sec : void 0;    
    return min+':'+sec;
}

let Time = (props) => {
    return(
        <div style={{position: "absolute", margin: 8, userSelect: "none"}}>
            {convertTime(props.time).substring(0, 8)}
        </div>
    )
}

Time = connect(state => { return {time: state.globals.time}})(Time)
TimeLine = connect(state => { return {time: state.globals.time}})(TimeLine)

class PlaybackPanel extends PureComponent {
    state={volume:100}

    volumeChange = (e) => {
        editProjectSettings({key: "masterVolume", value: e.target.value})
    }
    
    render() {
        // <Button disableRipple color="primary" type="raised" onClick={this.props.openFullScreen}>Fullscreen</Button>
        return(
            <div style={{display: "flex", flexDirection: "column", maxWidth: this.props.width}}>

                <TimeLine clipDuration={this.props.clipDuration} width={this.props.width}></TimeLine>
                
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, display: "flex", marginRight: "auto"}}>
                        <Time></Time>
                    </div>
                    <div style={{flex: 1, display: "flex", justifyContent:"center"}}>
                        {this.props.playing ? 
                            <PauseIcon  className={classes.icon} onClick={this.props.play}></PauseIcon>
                        :
                            <PlayIcon className={classes.icon} onClick={this.props.play}></PlayIcon>
                        }
                        
                        <StopIcon className={classes.icon} onClick={this.props.stop}></StopIcon>
                    </div>
                    <div style={{flex: 1, display: "flex", width: 120, marginLeft: "auto", justifyContent:"flex-end"}}>
                        <input  type="range" min="0" max="100" value={this.props.masterVolume} onChange={this.volumeChange}/>
                    </div> 
                    

                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        clipDuration: state.globals.clipDuration,
        masterVolume: state.globals.masterVolume
    }
}

export default connect(mapStateToProps)(PlaybackPanel)

//disabled={!this.props.encoderLoaded || this.props.encoding || this.props.streamClosed}