import React, {PureComponent} from 'react'
import classes from "./videocard.css"
import Youtube from 'react-youtube'
import { Redirect } from 'react-router-dom'
import { loadProjectFromFile, dispatchAction } from '@redux/actions/items'
import Audiotrack from '@material-ui/icons/Audiotrack'


const devPath = "http://localhost:3000/"
const prodPath = "https://musicvid.org/"

export default class VideoCard extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { expanded: false, mouseEntered: false, redirect: false }

        this.width = props.width;
        this.height = props.height;

        this.videoRef = React.createRef();
    }

    openTemplate = () => {
        fetch(devPath + this.props.demo.templateUrl)
        .then(res => {console.log(res); return res.json()})
        .then( response => {
            dispatchAction({type: "SET_GLOBAL_SETTINGS", payload: response.globals})
            loadProjectFromFile(response.items)
            this.setState({redirect: true})
        }).catch(error => {
            console.log(error)
        })
    }

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})

    hover = () => this.setState({mouseEntered: !this.state.mouseEntered})

    render() {
        const {title, artist, itemsUsed, song, videoLength, resolution, fps, bitrate, exportTime, fileSize, date, preset, templateUrl, videoId} = this.props.demo

        if (this.state.redirect === true) {
            return <Redirect to='/editor' />
        }

        return(
            <div className={classes.cardWrapper}>
                
                <div style={{textAlign: "center", transform: "translateY(15px)"}}><b >{title}</b></div>
                <br/>
                
                <Youtube 
                    videoId={videoId}
                    opts={{width: this.props.width, height: this.props.height}}
                ></Youtube>
                

                <div className={classes.cardInfo}>
                    
                    
                    <div className={classes.topGroupWrapper}>
                        <div className={classes.title}><Audiotrack style={classes.icon}></Audiotrack> {artist} - {song} </div>
                        <button onClick={this.openTemplate} disabled={!templateUrl}>template</button>
                    </div>

                    {this.state.expanded && 
                    <div className={classes.moreInfoExpandedWrapper}>
                           <div className={classes.moreInfoExpanded}> 
                                {itemsUsed && <div className={classes.infoItem}>Items used: {itemsUsed.map((e, i) => e + (i !== itemsUsed.length - 1 ? " - " : ""))} <br/> </div>}
                                {videoLength && <React.Fragment>Video Length: {videoLength} <br/> </React.Fragment>}
                                {resolution && <React.Fragment>Resolution: {resolution} <br/></React.Fragment>}
                                {fps && <React.Fragment>fps: {fps} <br/></React.Fragment>}
                                {bitrate && <React.Fragment>Bitrate: {bitrate} <br/> </React.Fragment>}
                                {preset && <React.Fragment>Export preset: {preset} <br/> </React.Fragment>}
                                {exportTime && <React.Fragment> Time to export: {exportTime} <br/></React.Fragment>}
                                {fileSize && <React.Fragment> Filesize: {fileSize} <br/></React.Fragment>}
                                {date && <React.Fragment> Date made: {date} <br/></React.Fragment>}
                           </div> 
                    </div>}

                    <div className={classes.moreInfo} onClick={this.toggleExpanded}>
                        <div className={classes.moreInfoText}>{ this.state.expanded ? "Less info" : "More info"} </div> 
                    </div>
                </div>
            </div>
        )
    }
}


/*
<video poster={posterUrl} controls={true} className={classes.video} width={this.width} height={this.height} muted="" data-reactid=".0.1.0.0">
                    <source type="video/mp4" data-reactid=".0.1.0.0.0" src={this.props.demo.url}/>>
                </video>
                */