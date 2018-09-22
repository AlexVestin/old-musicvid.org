import React, {PureComponent} from 'react'
import classes from "../showcase/videocard/videocard.css"


export default class VideoCard extends PureComponent {

    constructor(props) {
        super(props);

        this.width = props.width;
        this.height = props.height;
        this.videoRef = React.createRef();
    }


    render() {

        const widthInPx = window.innerWidth * this.props.width;
        const heightInPx = window.innerWidth * this.props.height;
        return(
            <div className={classes.cardWrapper} style={{marginTop: 25}}>
                <div style={{ backgroundColor: "rgba(200, 200, 200, 0.3)", minWidth: 200, minHeight: 100, width: widthInPx, height: heightInPx}}>       
                    <video 
                        poster="/demos/landingposter.png"
                        src="/demos/landingdemo.mp4" style={{minWidth: 200, minHeight: 100, width: widthInPx, height: heightInPx}}
                        controls
                    >

                    </video>
                </div>
            </div>
        )
    }
}
