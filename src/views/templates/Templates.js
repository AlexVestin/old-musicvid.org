import React, { PureComponent } from 'react'
import { loadProjectFromFile } from '@redux/actions/items'
import { Redirect } from 'react-router-dom'

export default class Templates extends PureComponent {

    state= { redirect: false }


    loadTemplate = () => {
        fetch("proj10.json")
        .then(res => res.json())
        .then( response => {
            loadProjectFromFile(response)
            this.setState({redirect: true})
        }
        )
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to='/editor' />
        }
      

        return(
            <div >
                
                <button onClick={this.loadTemplate}> Click here to laod template</button>

            </div>
        )
    }
}