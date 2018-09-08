import React, { PureComponent } from 'react'
import classes from './examples.css'
import img from './poster.png'

export default React.forwardRef((props, ref) => (
    <div  className={classes.container} ref={ref}>
        <div className={classes.wrapper}>
            <div className={classes.title}>Create </div>
            <div className={classes.grid}>
                
                <div className={classes.itemImageWrapper}>
                    <img src={img} className={classes.itemImage}></img>
                </div>

                <div className={classes.itemTextWrapper}>
                    <div className={classes.itemTitle}>
                        Template projects
                    </div>
                    <div> 
                        Browse template projects, simply import media (background images, and audio) and you're good to go.
                    </div>
                    <a href="/templates">Open templates</a>
                </div>

            <div className={classes.itemTextWrapper}>
                <div className={classes.itemTitle}>
                    Gallery
                </div>
                <div> 
                    Explore videos created with the musicvid.org editor
                </div>

                <a href="/showcase">Browse showcase</a>
            </div>

            <div className={classes.itemImageWrapper}>
                <img src={img} className={classes.itemImage}></img>
            </div>

            <div className={classes.itemImageWrapper}>
                <img src={img} className={classes.itemImage}></img>
            </div>
            <div className={classes.itemTextWrapper}>
                <div className={classes.itemTitle}>
                    Tutorial
                </div>
                <div> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et convallis metus, 
                    non ultricies justo. Praesent metus sapien
                </div>
                <a href="/tutorial">Browse tutorials</a>
            </div>

            </div>
        </div>

    </div>
  ));
  