
import React, { PureComponent } from 'react'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link } from 'react-router-dom'
import classes from './header.css'


import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

export default class NavBar extends PureComponent{
    state = {
        open: false,
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
          return;
        }
    
        this.setState({ open: false });
      };

    render() {

        const { open } = this.state;

        return (
            <div className={classes.navgroup}>
                <Button disableRipple style={{marginLeft: 50}}> <Link className={classes.link} to="/editor"> Editor </Link></Button>
                <Button disableRipple> <Link className={classes.link} to="/showcase"> showcase </Link> </Button>
                <Button disableRipple> <Link className={classes.link} to="/daily"> info </Link> </Button>

                <div>
                     <IconButton
                        buttonRef={node => {
                            this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : null}
                            aria-haspopup="true"
                            onClick={this.handleToggle}
                     >
                        <AccountCircle style={{}}></AccountCircle>
                    </IconButton>
 
                    <Popper className={classes.popper} open={open} anchorEl={this.anchorEl} transition placement="left" popperOptions={{preventOverflow: { enabled: false }}}>
                        {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: 'left bottom'}}
                        >
                            <Paper>
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <MenuList>
                                <MenuItem onClick={this.handleClose}><Link className={classes.link} to="/profile">Profile</Link></MenuItem>
                                <MenuItem onClick={this.handleClose}><Link className={classes.link} to="/projects">Projects</Link></MenuItem>
                                <MenuItem onClick={this.handleClose}><Link className={classes.link} to="/settings">Settings</Link></MenuItem>
                                <MenuItem onClick={this.handleClose}><Link className={classes.link} to="/logout">Sign Out</Link></MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                    </Popper>
                </div>
            </div>
        )
    }
}






