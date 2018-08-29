import React, { PureComponent } from 'react'
import classes from './register.css'

import TextInput from './textinput'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { setIsAuthenticated } from '@redux/actions/auth'
import { Link, Redirect } from 'react-router-dom'
import { app, facebookProvider, googleProvider } from '@backend/firebase'
import { connect } from 'react-redux'

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

class Login extends PureComponent {

    constructor() {
        super()

        this.emailRef = React.createRef()
        this.passwordRef = React.createRef() 
    }

    state = {
        fetching: false,
        emailError: null
    }

    submit = (event) => {
        event.preventDefault();
        this.setState({emailError: ""})

        const email = this.emailRef.current.getValue()
        const password = this.passwordRef.current.getValue()

        app.auth().fetchProvidersForEmail(email).then((providers) => {
            console.log(providers)
            if (providers.length !== 0 && providers.indexOf("password") === -1){
                this.setState({emailError: "This email is connected to either a Facebook or Google login"})
            }else {
                app.auth().signInWithEmailAndPassword(email,password).catch((error) => {
                    this.setState({emailError: "Username/password doesn't match, or the user doesn't exist"})
                })
            }
        })
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

    render() {
        if(this.props.isAuthenticated === true) {
            return <Redirect to="/editor"></Redirect>
        }

        if(this.props.fetching) {
            return <div className={classes.spinnerWrapper}><CircularProgress className={classes.spinner} /></div>
        }

        return(
            
            

            <div className={classes.container}>
                <div className={classes.wrapper}>
                
                    <form className={classes.form} onSubmit={this.submit}>
                        <h3 className={classes.title}>Sign in</h3>

                        <h3 className={classes.subheader}>Sign in with facebook or Google</h3>
                        <div className={classes.authButtonGroup}>
                            <Button style={{...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#3B5998', borderColor: '#3B5998'}} className={classes.socbutton} onClick={this.authWithFacebook}>facebook</Button>
                            <Button style={{...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}} className={classes.socbutton} onClick={this.authWithGoogle}>Google</Button>
                        </div>

                        <h3 className={classes.subheader}>Login with email/username and password</h3>
                        {this.state.emailError && <div className={classes.errorMessage}>{this.state.emailError}</div>}
                        <TextInput ref={this.emailRef} className={classes.input} type="email" label="email"></TextInput>
                        <TextInput ref={this.passwordRef} className={classes.input} type="password" label="password"></TextInput>
                        <input  style={bootstrapButtonStyle} className={classes.button} value="Login" type="submit"></input>  
                        <div className={classes.loginText}> Don't have an account? <Link to="/register" className={classes.text} > Create one!</Link></div>
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

export default connect(mapStateToProps)(Login)