import React, { PureComponent } from 'react'
import classes from './missing.css'
export default class MissingPage extends PureComponent {

    render() {
        return(

            <div className={classes.container}>
                
                <div className={classes.wrapper}>
                <div className={classes.title}>Error 404 - Page not found</div>

            </div>
        </div>
        )
    }
}

