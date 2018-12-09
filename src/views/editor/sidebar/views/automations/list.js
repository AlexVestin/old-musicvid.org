import React, { PureComponent } from 'react'
import  {connect } from 'react-redux'


class Automations extends PureComponent {

    render() {
        return(
            <div>
                halloe
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        automations: state.items.automations,
    }
}


export default connect(mapStateToProps)(Automations)
