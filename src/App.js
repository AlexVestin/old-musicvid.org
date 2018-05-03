import React, { Component } from 'react';
import classes from  './main.css'

import Canvas from './views/canvas/Canvas'
import Sidebar from "./views/sidebar/Sidebar"
import Playlist from './views/playlist/Playlist'

class App extends Component {
  render() {
    return (
        <div className={classes.wrapper}>
          <div className={classes.content_wrapper}>
            <Sidebar></Sidebar>
            <Canvas className={classes.canvas}></Canvas>
          </div>
          <Playlist className={classes.content_footer}></Playlist>
          <footer className={classes.footer}></footer>
       </div>
      
    );
  }
}

export default App;
