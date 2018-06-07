import React, { Component } from 'react';
import classes from  './main.css'
import { Route, Switch } from 'react-router-dom'

import Header from './views/header/header'


import Landing from './views/landing/Landing'
import Editor from './views/editor/Editor'

class App extends Component {
  render() {
    return (
        <div className={classes.wrapper}>
          <Header></Header>
          <Switch>
            <Route path="/landing" component={Landing}></Route>
            <Route path="/" component={Editor}></Route>
          </Switch>
          <footer className={classes.footer}></footer>
       </div>

    );
  }
}

export default App;
