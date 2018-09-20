import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import classes from './examples.css'
import img from './poster.png'
import upcoming from './upcoming2.jpg'
import things from './bg2.jpg'

export default React.forwardRef((props, ref) => (
    <div className={classes.container} ref={ref}>
        <div className={classes.wrapper}>
            <div className={classes.title}>Create </div>
            <div className={classes.grid}>
                
                <div className={classes.itemImageWrapper}>
                    <img src={things} className={classes.itemImage}></img>
                </div>

                <div className={classes.itemTextWrapper}>
                    <div className={classes.itemTitle}>
                        Template projects
                    </div>
                    <div className={classes.subTitle}> 
                        Browse template projects, simply import media (background images, and audio) and you're good to go.
                    </div>
                    <Link className={classes.link} to="/showcase">Open templates</Link>
                </div>

            <div className={classes.itemTextWrapper}>
                <div className={classes.itemTitle}>
                    Roadmap
                </div>
                <div className={classes.subTitle}> 
                    This site is still in its' infancy, and there are many exciting updates coming up. Here is a list of animations 
                    we're looking to add.
                </div>

                <Link className={classes.link} to="/roadmap">Browse roadmap</Link>
            </div>

            <div className={classes.itemImageWrapper}>
                <img src={upcoming} className={classes.itemImage}></img>
            </div>

            <div className={classes.itemImageWrapper}>
                <img src={img} className={classes.itemImage}></img>
            </div>
            <div className={classes.itemTextWrapper}>
                <div className={classes.itemTitle}>
                    Tutorial
                </div>
                <div className={classes.subTitle}> 
                    Navigating the editor can be hard, so we have prepared some tutorials and answered some questions that you might have 
                </div>
                <Link className={classes.link} to="/tutorial">Browse tutorials</Link>
            </div>

            </div>
        </div>

    </div>
  ));
  