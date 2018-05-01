import React, { PureComponent } from 'react'
import SimpleTabs from "./tabs"
import classes from "./sidebar.css"

export default class Sidebar extends PureComponent {

    render() {
        return ( 
            <div className={classes.wrapper}>
                <SimpleTabs className={classes.tabs}></SimpleTabs>
            </div>
        )
    }
}