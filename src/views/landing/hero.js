import React, { PureComponent } from 'react'
import classes from './hero.css'
import Video from './video'
import { Link } from 'react-router-dom' 
import KeyBoardArrowDown from '@material-ui/icons/KeyboardArrowDown'

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
            <div className={classes.container}  ref={this.props.forwardRef}>
                <div className={classes.wrapper}>
                    
                    <h1 className={classes.description}>musicvid.org</h1>
                    <h3 className={classes.subtitle}>Free online music video creator.</h3>
                    <br/>
                    <h3 className={classes.subdescriptor}>Create unique audio visualizations and animation in minutes, powered by designers from all around the web.</h3>
                    
                    <Video width={640} height={480} videoId="qOO7wx-iqbM"></Video>

                    <div className={classes.buttonWrapper}>
                        <Link style={bootstrapButtonStyle} className={classes.button} to="/editor">open editor</Link>
                    </div>
                    <KeyBoardArrowDown  onClick={this.props.scrollTo} className={classes.arrowDown}></KeyBoardArrowDown>
                </div>

            </div>
        )
    }
}

