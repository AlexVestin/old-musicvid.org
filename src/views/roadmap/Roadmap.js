import React, { PureComponent } from 'react'
import classes from './roadmap.css'
import items from './items.js'
import CheckCircleOutline from '@material-ui/icons/CheckCircle'

export default class Roadmap extends PureComponent {

    render() {
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.title}>Items of interest</div>

                    {items.items.map(item => {

                        return (
                            <div className={classes.itemWrapper}>
                                <a href={item.url}>{item.url}</a>

                                <div className={classes.iconWrapper} style={{color: item.progressColor}}>
                                    <CheckCircleOutline></CheckCircleOutline>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}