import React, { Component } from 'react';
import classes from  './Editor.css'

import Canvas from './canvas/Canvas'
import Sidebar from "./sidebar/Sidebar"
import SidebarHeader from './sidebar/sidebarheader'
import Playlist from './playlist/Playlist'

import {Redirect, Prompt} from 'react-router-dom' 
import { connect } from 'react-redux'


class App extends Component {
  render() {

    if(!this.props.isAuthenticated && !this.props.isFetching) {
      return <Redirect to="/login"></Redirect>
    }else if(this.props.isFetching) {
      return <div>loading...</div>
    }
      
    return (
        <div className={classes.wrapper}>
          <Prompt message={location => location.pathname !== "/editor" ? "Are you sure you want to exit editor, all progress will be lost" : true}></Prompt>
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

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isFetching: state.auth.fetching
  }
}

export default connect(mapStateToProps)(App);
