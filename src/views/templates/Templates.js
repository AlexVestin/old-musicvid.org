import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import { Redirect } from 'react-router-dom'

const devPath = "http://localhost:3000/"
const prodPath = "https://musicvid.org/"


export default class Templates extends PureComponent {

    state = { redirect: false }

    loadTemplate = () => {
        fetch(devPath + "templates/test3.json")
        .then(res => res.json())
        .then( response => {

            dispatchAction({type: "SET_GLOBAL_SETTINGS", payload: response.globals})
            dispatchAction({type: "LOAD_PROJECT_FROM_FILE", payload: response.items})
            console.log(response.items)
            this.setState({redirect: true})
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        if (this.state.redirect === true) {
            console.log("REDIRECTING")
            return <Redirect to='/editor' />
        }
    
        return(
            <div >
                <button onClick={this.loadTemplate}> Click here to load template</button>
            </div>
        )
    }
}