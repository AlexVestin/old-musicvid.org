import React, { PureComponent } from 'react'
import classes from './missing.css'
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'

export default class MissingPage extends PureComponent {

    state = {redirect: false};
    redirect = () => {
        this.setState({redirect: true})
    }
    render() {

        if(this.state.redirect)
            return <Redirect to="/"></Redirect>

        return(

            <div className={classes.container}>
                
                <div className={classes.wrapper}>
                <div className={classes.title}>Error 404 - Page not found</div>
                <Button onClick={this.redirect}>Return to site</Button>
            </div>
        </div>
        )
    }
}

