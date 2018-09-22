import React, { Component } from 'react';
import classes from  '../main.css'
import { Route, Switch } from 'react-router-dom'

import Header from './header/header'
import Landing from './landing/Landing'
import Info from './info/Info'
import MissingPage from './missing/Missing'
import RoadMap from './roadmap/Roadmap'
import Settings from './settings/Settings'
import Projects from './projects/Projects'
import Logout from './login/Logout'
import Register from './login/Register'
import Acknowledgements from './acknowledgements/Acknowledgements'

import Profile from './profile/Profile'
import { app } from '../firebase/firebase'
import { setIsAuthenticated } from '@redux/actions/auth'

class App extends Component {

  state = {
    editor: null,
    showcase:  null,  
    register: null,
    privacy: null,
    login: null,
    templates: null
  }

  componentDidMount() {
    
    import("./editor/Editor").then((mod) => this.setState(() => ({ editor: mod.default })))
    import("./login/Login").then((mod) => this.setState(() => ({ login: mod.default })))
    import("./info/Privacy").then((mod) => this.setState(() => ({ privacy: mod.default })))
    import("./showcase/Showcase").then((mod) => this.setState(() => ({ showcase: mod.default })))

      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
          this.setState({loaded: false})
          if(user) {
              setIsAuthenticated(true);
          }else {
              setIsAuthenticated(false);
              console.log("?????")
          }
      }) 
    
  }

  componentWillUnmount = () => {
    this.removeAuthListener();
  }

  render() {
    return (
        <div className={classes.wrapper}>
          {window.location.pathname.split("/")[1] !== "" && <Header></Header>}
          <Switch>
            <Route path="/editor" component={this.state.editor}></Route>
            <Route path="/showcase" component={this.state.showcase}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/login" component={this.state.login}></Route>
            <Route path="/logout" component={Logout}></Route>
            <Route path="/info" component={Info}></Route>
            <Route path="/privacy" component={this.state.privacy}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/projects" component={Projects}></Route>
            <Route path="/settings" component={Settings}></Route>
            <Route path="/acknowledgements" component={Acknowledgements}></Route>
            <Route path="/roadmap" component={RoadMap}></Route>
            <Route exact path="/" component={Landing}></Route>
            <Route component={MissingPage}></Route>   
          </Switch>
       </div>

    );
  }
}

export default App;
