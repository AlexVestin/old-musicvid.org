import React, { Component } from 'react';
import classes from  './main.css'

import Canvas from './Canvas'
import SingleLineGridlist from './gridlist'

class App extends Component {
  render() {
    return (
      <div className={classes.wrapper}>

          <div className={classes.content_wrapper}>
            <div className={classes.content_header}></div>
            <Canvas></Canvas>
            <div className={classes.content_footer}>
            <SingleLineGridlist></SingleLineGridlist>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
