import React, { Component } from 'react';
import classes from  './Editor.css'

import Canvas from './canvas/Canvas'
import Sidebar from "./sidebar/Sidebar"
import SidebarHeader from './sidebar/sidebarheader'
import Playlist from './playlist/Playlist'

class App extends Component {
  render() {
    return (
        <div className={classes.wrapper}>
          <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            
            <SidebarHeader></SidebarHeader>

            <div className={classes.content_wrapper}>
              <Sidebar></Sidebar>
              <Canvas className={classes.canvas}></Canvas>
            </div>
            <Playlist className={classes.content_footer}></Playlist>
            </div>
          </div>
    );
  }
}

export default App;
