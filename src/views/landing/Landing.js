import React, { PureComponent } from "react";

import Hero from './hero'
import Examples from './examples/examples'
import Footer from './footer'
import classes from './landing.css'


export default class Landing extends PureComponent {

    constructor() {
        super()

        this.ref = React.createRef()
        this.examplesRef = React.createRef();
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

    scrollToContent = (content) => {
        console.log(this.examplesRef.current, this.examplesRef)
        this.examplesRef.current.scrollIntoView({behavior: 'smooth', alignToTop: true, block: "start", inline: "nearest"});
    }



    render() {
        
        return(
            <div className={classes.container} ref={ el => this.ref = el}>
                <Hero scrollTo={this.scrollToContent}></Hero>
                <Examples ref={this.examplesRef}></Examples>
                <Footer></Footer>
            </div>
        )
    }
}