import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { unregister } from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'

unregister();
injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('root'));
