import React, { PureComponent } from 'react'
import classes from './faq.css'
import Youtube from 'react-youtube'
import FrequentlyAsked from './freq'

export default class Tutorial extends PureComponent {

    render() {
        return(

            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.title}>
                        Video tutorial
                    </div>
                    <Youtube 
                            videoId="AgCqZbcUArc"
                            opts={{
                                width: 640, 
                                height: 480,
                                playerVars: { // https://developers.google.com/youtube/player_parameters
                                    autoplay: 0,
                                    showinfo: 0
                                }
                            }}
                        >
                    </Youtube>

                     <div className={classes.title}>
                        Questions
                    </div>
                    <FrequentlyAsked></FrequentlyAsked>
            </div>

            
        </div>
        )
    }
}

