import React, { Component } from 'react';
import classes from  '../main.css'
import { Route, Switch } from 'react-router-dom'

import Header from './header/header'
import Landing from './landing/Landing'
import Info from './info/Info'
import MissingPage from './missing/Missing'
 

import { base, app } from '../firebase/firebase'
import { setIsAuthenticated } from '@redux/actions/auth'

class App extends Component {

  state = {
    editor: null,
    showcase:  null,  
    register: null,
    privacy: null,
    login: null,
    logout: null
  }

  componentDidMount() {
    import("./editor/Editor").then((mod) => this.setState(() => ({ editor: mod.default })))
    import("./login/Login").then((mod) => this.setState(() => ({ login: mod.default })))
    import("./login/Register").then((mod) => this.setState(() => ({ register: mod.default })))
    import("./info/Privacy").then((mod) => this.setState(() => ({ privacy: mod.default })))
    import("./showcase/Showcase").then((mod) => this.setState(() => ({ showcase: mod.default })))
    import("./login/Logout").then((mod) => this.setState(() => ({ logout: mod.default })))


      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
          this.setState({loaded: false})
          if(user) {
              setIsAuthenticated(true);
          }else {
              setIsAuthenticated(false);
          }
      }) 
    
  }

  componentWillUnmount = () => {
    this.removeAuthListener();
  }

  render() {
    return (
        <div className={classes.wrapper}>
          <Header></Header>
          <Switch>
            <Route path="/editor" component={this.state.editor}></Route>
            <Route path="/showcase" component={this.state.showcase}></Route>
            <Route path="/register" component={this.state.register}></Route>
            <Route path="/login" component={this.state.login}></Route>
            <Route path="/logout" component={this.state.logout}></Route>
            <Route path="/info" component={Info}></Route>
            <Route path="/privacy" component={this.state.privacy}></Route>
            <Route exact path="/" component={Landing}></Route>
            <Route component={MissingPage}></Route> 
  
          </Switch>
          <footer className={classes.footer}></footer>
       </div>

    );
  }
}

export default App;
