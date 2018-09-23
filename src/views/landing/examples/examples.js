import React from 'react'
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
                    Join the community
                </div>
                <div className={classes.subTitle}> 
                    Have suggestions or features you'd like to see implemented? Bugs or unexpected behaviour?  
                    <br></br>
                    Join the discord channel and help 
                    move this site forward!
                </div>

                <a className={classes.link} href="https://discord.gg/CnfEeM">https://discord.gg/CnfEeM</a>
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
  