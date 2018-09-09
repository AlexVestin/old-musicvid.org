import React, { PureComponent } from 'react'
import classes from './examples.css'
import img from './poster.png'
import upcoming from './upcoming.jpg'
import things from './bg.jpg'

export default React.forwardRef((props, ref) => (
    <div  className={classes.container} ref={ref}>
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
                    <a className={classes.link} href="/templates">Open templates</a>
                </div>

            <div className={classes.itemTextWrapper}>
                <div className={classes.itemTitle}>
                    Roadmap
                </div>
                <div className={classes.subTitle}> 
                    This site is still in its' infancy, and there are many exciting updates coming up. 
                     
                </div>

                <a className={classes.link} href="/roadmap">Browse showcase</a>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et convallis metus, 
                    non ultricies justo. Praesent metus sapien
                </div>
                <a className={classes.link} href="/tutorial">Browse tutorials</a>
            </div>

            </div>
        </div>

    </div>
  ));
  