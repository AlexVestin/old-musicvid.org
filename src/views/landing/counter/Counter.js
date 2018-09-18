import React, { PureComponent } from 'react'
import classes from './counter.css'
import { base } from '@backend/firebase'

export default class Counter extends PureComponent {


    state = { number: 0}

    componentDidMount() {
        base.ref("/counter").once("value").then(snapshot => {
            this.setState({number: snapshot.val()})    
        })
    }

    render() {

        return(
            <div className={classes.container}>
              <div className={classes.wrapper}>

                    <div className={classes.groupWrapper}>
                        <h1 className={classes.number1}>30+</h1>
                        <h2 className={classes.text}>Animations to choose from</h2>
                    </div>

                     <div className={classes.groupWrapper}>
                        <h1 className={classes.number}>{this.state.number}</h1>
                        <h2 className={classes.text}>videos exported since launch</h2>
                    </div>

                     <div className={classes.groupWrapper}>
                        <h1 className={classes.number1}>100%</h1>
                        <h2 className={classes.text}>Free of bugs and unexpected behaviour</h2>
                    </div>

                </div>
            </div>
        )
    }
}