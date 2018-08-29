
import React, { PureComponent } from 'react'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link } from 'react-router-dom'
import classes from './header.css'

export default class NavBar extends PureComponent{


    render() {
        return (
            <div className={classes.navgroup}>
                <Button  style={{marginLeft: 50}} disableRipple> <Link className={classes.link} to="/"> Editor </Link></Button>
               

                <Button disableRipple> <Link className={classes.link} to="/showcase"> showcase </Link> </Button>
                <Button disableRipple> <Link className={classes.link} to="/daily"> info </Link> </Button>
                <Button disableRipple> <Link className={classes.link} to="/logout"> logout </Link></Button>

                <div className={classes.user_group}>
                    <IconButton>
                        <AccountCircle style={{}}></AccountCircle>
                    </IconButton>
                </div> 
            </div>
        )
    }
}






