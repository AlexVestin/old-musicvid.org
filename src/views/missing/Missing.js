import React, { PureComponent } from 'react'
import classes from './missing.css'
export default class MissingPage extends PureComponent {

    render() {
        return(

            <div className={classes.container}>
                
                <div className={classes.wrapper}>
                <div className={classes.title}>Error 404 - Page not found</div>
                OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!                        

            </div>
        </div>
        )
    }
}

