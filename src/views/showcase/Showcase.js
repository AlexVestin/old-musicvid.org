import React, {PureComponent} from 'react'
import VideoCard from './videocard/card'
import classes from './showcase.css'

import Demos from './demos'

class Showcase extends PureComponent {

    constructor(props) {
        super(props);

        this.videoWidth = 460;
        this.videoHeight = 240;
    }

    render() {
        return(
            <div className={classes.container}>
                <div className={classes.titleWrapper}> <div className={classes.title}>Video showcase</div></div>
                <div className={classes.wrapper}>
                    
                    {Object.keys(Demos).map(key => 
                        <VideoCard key={key} demo={Demos[key]} width={this.videoWidth} height={this.videoHeight}></VideoCard>
                    )}
                </div>
            </div>
        )
    }
}


export default Showcase
