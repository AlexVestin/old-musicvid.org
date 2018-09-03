import React, { PureComponent } from 'react'
import classes from './hero.css'
import Video from './video'
import { Link } from 'react-router-dom' 


const bootstrapButtonStyle = {
    marginLeft: 15,
    marginRight: 15,
    boxShadow: 'none',
    color: "white",
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    width: 125,
    textAlign: "center"
}
  
export default class Header extends PureComponent {

    render() {
        return(
            <div className={classes.container} >
                <div className={classes.wrapper}>
                    
                    <h1 className={classes.description}>musicvid.org</h1>
                    <h3 className={classes.subtitle}>Free online music video editor</h3>
                    
                    <div className={classes.buttonWrapper}>
                        <Link style={bootstrapButtonStyle} className={classes.button} to="/editor">open editor</Link>
                        <Link style={bootstrapButtonStyle} className={classes.button} to="/tutorial">tutorials</Link>
                        <Link style={bootstrapButtonStyle} className={classes.button} to="/showcase">showcase</Link>
                    </div>

                    <Video width={720} height={480} videoId="qOO7wx-iqbM"></Video>
                </div>
            </div>
        )
    }
}