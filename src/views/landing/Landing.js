import React, { PureComponent } from "react";

import Hero from './hero'
import Examples from './examples/examples'
import Footer from './footer'
import classes from './landing.css'


export default class Landing extends PureComponent {

    constructor() {
        super()

        this.ref = React.createRef()
        this.state = { scrollY: 0}
    }
    state = {scrollPosition: 0}

    onScroll = (event) => {
    }

    componentDidMount = () => {
        this.el = window.addEventListener("wheel", this.onScroll, false)
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.onScroll, false);
    }



    render() {
        
        return(
            <div className={classes.container} ref={ el => this.ref = el}>
                <Hero></Hero>
                <Examples></Examples>
                <Footer></Footer>
            </div>
        )
    }
}