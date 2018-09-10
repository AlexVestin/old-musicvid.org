
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Projects extends PureComponent {

    render() {
        const  {fetching, isAuthenticated} = this.props

        if(this.props.fetching === true) {
            return <div>loading</div>
        }

        if(this.props.isAuthenticated !== true) {
            return <Redirect to="/"></Redirect>
        }
            
        return(

            <div>Project will go here</div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        fetching: state.auth.fetching
    }
}


export default connect(mapStateToProps)(Projects)