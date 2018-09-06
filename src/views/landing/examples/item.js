import React, { PureComponent } from "react";
import classes from './examples.css'
import img from './poster.png'

export default class Item extends PureComponent {

    render() {
        return(
            <div className={classes.item}>
                <div className={classes.itemImageWrapper}>
                    <img src={img} className={classes.itemImage}></img>
                </div>
                <div className={classes.itemTextWrapper}>
                    <div className={classes.itemTitle}>
                        Title
                    </div>
                    <div> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et convallis metus, 
                        non ultricies justo. Praesent metus sapien
                    </div>
                </div>
            </div>
        )
    }
}