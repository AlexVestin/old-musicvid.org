import React, { PureComponent } from 'react'
import classes from './register.css'

import TextInput from './textinput'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { setIsAuthenticated } from '@redux/actions/auth'
import { Redirect } from 'react-router-dom'
import { app, facebookProvider, googleProvider } from '@backend/firebase'
import { connect } from 'react-redux'

const bootstrapButtonStyle = {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    boxShadow: 'none',
    color: "white",
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#007bff',
    borderColor: '#007bff'
}

class Register extends PureComponent {

    constructor() {
        super()



        this.state = { errorMessage: "", passwordError: ""}
        this.emailRef = React.createRef()
        this.userNameRef = React.createRef()
        this.passwordRef = React.createRef()
        this.confirmPasswordRef = React.createRef()

    }

    authWithGoogle = () => {
        app.auth().signInWithPopup(googleProvider).then(
            (result, error) => {
                if(error) {
                    this.setState({error: "Unable to sign in with Google."})
                }else {
                    setIsAuthenticated(true);
                }
            }
        );
    }

    authWithFacebook = () => {
        app.auth().signInWithPopup(facebookProvider).then(
            (result, error) => {
                if(error) {
                    this.setState({error: "Unable to sign in with Facebook."})
                }else {
                    setIsAuthenticated(true);
                }
            }
        )
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

        if(this.props.isAuthenticated) {
            return <Redirect to="/editor"></Redirect>
        }
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={this.submit}>
                        <h3 className={classes.title}>Sign up with Google/Facebook</h3>
                        <Button style={{...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#3B5998', borderColor: '#3B5998'}} className={classes.socbutton} onClick={this.authWithFacebook}>Sign up with facebook</Button>
                        <Button style={{...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}} className={classes.socbutton} onClick={this.authWithGoogle}>Sign up with Google</Button>
                        

                        {errorMessage !== "" && <div className={classes.errorMessage}>{errorMessage}</div>}

                        <h3 className={classes.title}>Sign up with email and password</h3>
                        <TextInput ref={this.emailRef} className={classes.input} type="email" label="email"></TextInput>
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

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(Register)