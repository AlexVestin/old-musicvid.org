import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { unregister } from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'
import store from './redux/store'
import { Provider } from 'react-redux'

unregister();
injectTapEventPlugin();
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
