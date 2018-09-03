
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import classes from './header.css'


const bootstrapButtonStyle = {
    boxShadow: 'none',
    color: "#333",
    fontSize: 16,
    padding: '6px 12px',
    width: 90,
    textAlign: "center"
}

export default class LoginGroup extends PureComponent{

    render() {
        return (
            <div className={classes.buttonWrapper}>
                
                <Link style={bootstrapButtonStyle} className={classes.button} to="/register">Sign up</Link>
                <Link style={bootstrapButtonStyle} className={classes.button} to="/login">Login</Link>

            </div>
        )
    }
}


