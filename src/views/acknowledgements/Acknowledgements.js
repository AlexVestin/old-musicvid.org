import React, { PureComponent } from 'react'
import classes from './acknowledgements.css'
import items from './items'

export default class Roadmap extends PureComponent {

    render() {
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.title}>Stack</div>

                    {items.items.map(item => {

                        return (
                            <div className={classes.itemWrapper}>
                                <div>{item.description}</div>
                                <a href={item.url}>{item.url}</a>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}