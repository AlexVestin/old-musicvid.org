import React, { PureComponent } from 'react'
import classes from './register.css'

import TextInput from './textinput'
import {Link} from 'react-router-dom'

import { app } from '@backend/firebase'

const bootstrapButtonStyle = {
    marginLeft: 15,
    marginRight: 15,
    boxShadow: 'none',
    color: "white",
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#007bff',
    borderColor: '#007bff'
}

export default class Register extends PureComponent {

    constructor() {
        super()

        this.state = { errorMessage: "", passwordError: ""}
        this.emailRef = React.createRef()
        this.userNameRef = React.createRef()
        this.passwordRef = React.createRef()
        this.confirmPasswordRef = React.createRef()

    }

    submit = (event) => {
        event.preventDefault();
        this.setState({errorMessage: "", passwordError: ""})
        
        const email = this.emailRef.current.getValue()
        const password = this.passwordRef.current.getValue()
        const confirmPassword = this.confirmPasswordRef.current.getValue()

        if(password !== confirmPassword){
            this.setState({passwordError: "Passwords don't match"})
            return
        }

        if(password.length < 6) {
            this.setState({passwordError: "Password must be atleast 6 characters long"})
            return
        }
        app.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
            var errorMessage = error.message;
            this.setState({errorMessage: errorMessage})
        });     
    }

    render() {
        const { passwordError, errorMessage } = this.state
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={this.submit}>
                        <h3 className={classes.title}>New account :)</h3>´
                        {errorMessage !== "" && <div className={classes.errorMessage}>{errorMessage}</div>}
                        <TextInput ref={this.emailRef} className={classes.input} type="email" label="email"></TextInput>
                        <TextInput ref={this.userNameRef} className={classes.input} label="username" ></TextInput>
                        <TextInput ref={this.passwordRef} className={classes.input} type="password" label="password" errorMsg={passwordError}></TextInput>
                        <TextInput ref={this.confirmPasswordRef} className={classes.input} type="password" label="password again" errorMsg={passwordError}></TextInput>
                        <input style={bootstrapButtonStyle} className={classes.button} value="Register" type="submit"></input>  
                        <div className={classes.loginText}> Already have an account? <Link to="/login" className={classes.text} > Login!</Link></div>
                    </form>
                </div>
            </div>
        )
    }
}