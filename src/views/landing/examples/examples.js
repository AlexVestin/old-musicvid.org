import React, { PureComponent } from 'react'
import classes from './examples.css'
import Item from './item'
import ReverseItem from './reverseitem'

export default class Examples extends PureComponent {

    render() {
        return(
            <div  className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.title}>Title</div>
                    <Item></Item>
                    <ReverseItem></ReverseItem>
                    <Item></Item>
                </div>
            </div>
        )
    }
}