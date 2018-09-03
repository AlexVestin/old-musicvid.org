import React, { PureComponent } from "react";

import Hero from './hero'
import Examples from './examples'
import Footer from './footer'
import classes from './landing.css'


export default class Landing extends PureComponent {

    render() {
        return(
            <div className={classes.container}>
                <Hero></Hero>
                <Footer></Footer>
            </div>
        )
    }
}