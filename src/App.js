import React, { Component } from 'react';
import './main.css'
import Canvas from './Canvas'

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="sidebar-wrapper">
        </div>
          <div className="content-wrapper">
            <div id="drag-horizontal"></div>
            <div className="content-header"></div>
            <Canvas></Canvas>
            <div className="content-footer"></div>
        </div>
      </div>
    );
  }
}

export default App;
