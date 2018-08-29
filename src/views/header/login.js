
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import classes from './header.css'

export default class LoginGroup extends PureComponent{

    render() {
        return (
            <React.Fragment>
                <Link className={classes.text} to="/login"> Login/Register Account </Link>

            </React.Fragment>
        )
    }
}


