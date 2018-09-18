import React, {PureComponent} from 'react'
import classes from "../showcase/videocard/videocard.css"
import Youtube from 'react-youtube'


export default class VideoCard extends PureComponent {

    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;
        this.videoRef = React.createRef();
    }


    render() {
        const { width, height } = this.props

        const widthInPx = window.innerWidth * this.props.width;
        const heightInPx = window.innerWidth * this.props.height;
        return(
            <div className={classes.cardWrapper} style={{marginTop: 25}}>
                <div style={{ backgroundColor: "rgba(200, 200, 200, 0.3)", minWidth: 200, minHeight: 100, width: widthInPx, height: heightInPx}}>       
                    <Youtube 
                        videoId={ this.props.videoId}
                        opts={{
                            width: widthInPx, 
                            height: heightInPx,
                            playerVars: { // https://developers.google.com/youtube/player_parameters
                                autoplay: 0,
                                showinfo: 0
                              }
                        }}
                    >
                    </Youtube>
                </div>
            </div>
        )
    }
}
