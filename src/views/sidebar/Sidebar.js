import React, { PureComponent } from 'react'
import SimpleTabs from "./tabs"
import classes from "./sidebar.css"

export default class Sidebar extends PureComponent {
    constructor(props){
        super(props)
    }

    render() {
        return ( 
            <div className={classes.wrapper}>
                <SimpleTabs className={classes.tabs}></SimpleTabs>
            </div>
        )
    }
}