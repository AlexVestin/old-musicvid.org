import React, { Component } from 'react';
import classes from  './main.css'

import Canvas from './views/canvas/Canvas'
import Sidebar from "./views/sidebar/Sidebar"

class App extends Component {
  render() {
    return (
      <div className={classes.wrapper}>
          <Sidebar></Sidebar>
          <div className={classes.content_wrapper}>
            <div className={classes.content_header}></div>
            <Canvas></Canvas>
            <div className={classes.content_footer}>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
