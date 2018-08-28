import React, { PureComponent } from "react";

import Header from './header'
import Examples from './examples'
import Footer from './footer'
import classes from './landing.css'


export default class Landing extends PureComponent {

    render() {
        return(
            <div className={classes.container}>
                <Header></Header>
                <Footer></Footer>
            </div>
        )
    }
}