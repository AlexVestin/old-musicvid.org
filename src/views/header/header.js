import React, {PureComponent} from 'react'
import classes from './header.css'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'

import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link } from 'react-router-dom'

class Header extends PureComponent {

    render() {
        return (
            <div className={classes.header}>
                <div className={classes.user_group}>
                    <div className={classes.logo}>
                        <h1>musicvid.org</h1>
                    </div>
                    
            
                </div>
               
            </div>
        )
    }
}

/*
                    <Button  style={{marginLeft: 50}} disableRipple> <Link className={classes.link} to="/"> Editor </Link></Button>
                    <Button  disableRipple> <Link className={classes.link} to="/landing"> Landing </Link> </Button>

                    <Button  disableRipple> <Link className={classes.link} to="/showcase"> Showcase </Link> </Button>
                    <Button  disableRipple> <Link className={classes.link} to="/daily"> info </Link> </Button>


                     <div className={classes.user_group}>
                    <IconButton>
                        <AccountCircle style={{}}></AccountCircle>
                    </IconButton>
                </div> 
            */

export default Header;