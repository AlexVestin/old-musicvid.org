import React, { PureComponent } from "react";

import Hero from './hero'
import Examples from './examples/examples'
import Footer from './footer'
import Counter from './counter/Counter'
import classes from './landing.css'


export default class Landing extends PureComponent {

    constructor() {
        super()

        this.ref = React.createRef()
        this.examplesRef = React.createRef();
    }
    state = {scrollPosition: 0}

    scrollToContent = (content) => {
        this.examplesRef.current.scrollIntoView({behavior: 'smooth', alignToTop: true, block: "start", inline: "nearest"});
    }

    render() {   
        return(
            <div className={classes.container} >
                <Hero scrollTo={this.scrollToContent}></Hero>
                
                <Counter></Counter>
                <Examples ref={this.examplesRef}></Examples>
                <Footer></Footer>
            </div>
        )
    }
}