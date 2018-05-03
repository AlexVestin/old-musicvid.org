import React, { Component } from 'react';
import classes from  './main.css'

import Canvas from './views/canvas/Canvas'
import Sidebar from "./views/sidebar/Sidebar"
import Playlist from './views/playlist/Playlist'

class App extends Component {
  render() {
    return (
      <div className={classes.pageWrapper}>
      <div className={classes.header}></div>
      <div className={classes.wrapper}>
        
          <Sidebar></Sidebar>
          <div className={classes.content_wrapper}>
            <Canvas></Canvas>
            <Playlist className={classes.content_footer}></Playlist>
        </div>
        
      </div>
        <div className={classes.footer}></div>
      </div>
      
    );
  }
}

export default App;
