import React, {PureComponent} from 'react'
import classes from './header.css'
import { Link } from 'react-router-dom'

import NavGroup from './navbar'
import LoginGroup from './login'
import {connect} from 'react-redux'

class Header extends PureComponent {
    render() {
         return (
            <div className={classes.header}>
                <div className={classes.user_group}>
                    <div className={classes.logo}>
                        <Link to="/" style={{textDecoration: "none", color: "#f67600"}}><h1 className={classes.logolink} to={"/register"}>musicvid.org</h1></Link>
                    </div>
                    
                    {!this.props.isAuthenticated
                        ?
                        <React.Fragment>{!this.props.fetching && <LoginGroup></LoginGroup>} </React.Fragment>
                        :
                        <NavGroup></NavGroup>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        fetching: state.auth.fetching
    }
}



export default connect(mapStateToProps)(Header);