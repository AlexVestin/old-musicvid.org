
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Settings extends PureComponent {

    render() {
        if(this.props.fetching === false && this.props.isAuthenticated !== true) {
            return <Redirect to="/"></Redirect>
        }
            
        return(
            <div>Settings will go here</div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        fetching: state.auth.fetching
    }
}


export default connect(mapStateToProps)(Settings)