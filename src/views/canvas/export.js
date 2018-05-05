import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import Options from './options'


const presetLookup = [
    "ultrafast",
    "veryfast",
    "fast",
    "medium",
    "slow",
    "veryslow"
];


const style= {
    top: `30%`,
    left: `30%`,
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class SimpleModal extends React.Component {
  
    handleClose = () => {
        this.props.onCancel()
    }

    saveBlob = (vid) => {
        let fps = (this.frames * this.duration) / ((this.stopTime - this.startTime) / 1000)
        this.setState({info: "Saving video!", encoding: false}, () => setTimeout(this.setState({info: "Video encoded at: " + String(fps) + " frames per second"}), 8000 ))
        window.requestAnimationFrame(this.renderScene)
        const blob = new Blob([vid], { type: 'video/mp4' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
        }else { 
          const link = this.linkRef;
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', "vid.mp4");
          link.click();
        } 
        this.encodedFrames = 0
        //this.streamClosed = false
        this.setState({encoding: false})
    }

    encode = () => {
        //Video config
        let sp = this.res.split("x")
        let [w,h] = [Number(sp[0]), Number(sp[1])]
        this.frames = Number(this.fps)
        let br = Number(this.br.slice(0, -1)) * 1000
        let presetIdx = presetLookup.indexOf(this.pre)
        const config = {
            fps: this.frames,
            width: w,
            height: h, 
            duration: 300,
            bitrate: br,
            presetIdx: presetIdx
        }

        this.props.startEncoding(config)
    }

    stopEncoding = ()  => {
        cancelAnimationFrame(this.frameId)
      }

    encoderInit = () => {
        this.startTime = performance.now()
    }

    onEncoderLoaded = () => {
        this.setState({encoderLoaded: true, info: "Module loaded"})
    }
    
    
    render() {
        const { classes } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}
                onClose={this.handleClose}
            >
                <div style={style} className={classes.paper}>
                    <Typography variant="title" id="modal-title">
                        Export video
                    </Typography>
                    <Typography variant="subheading" id="simple-modal-description">
                        
                    </Typography>
                        
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <Options onchange={format => this.format = format} name="format" labels={["mp4"]} disabled></Options>
                        <Options onchange={v => this.res = v} name="resolution" labels={["720x480", "1280x720","1920x1080","2048x1080"]}></Options>
                        <Options onchange={v => this.fps = v} name="fps" labels={["25", "30", "60"]}></Options>
                        <Options onchange={v => this.br = v} name="bitrate" labels={["1000k", "2000k", "4000k", "6000k", "8000k", "12000k"]}></Options>
                        <Options onchange={v => this.pre = v} name="preset" labels={["ultrafast", "veryfast", "fast", "medium", "slow", "veryslow"]}></Options>
                        <Button onClick={this.encode}>Start</Button>
                    </div>
                </div>
            </Modal>
        );
    }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const ModalS = withStyles(styles)(SimpleModal);

export default ModalS;