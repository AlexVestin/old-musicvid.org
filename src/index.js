import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { unregister } from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { JssProvider } from 'react-jss'
import {createGenerateClassName} from './generateclassname'


if (process.env.NODE_ENV !== 'production') {
    const {whyDidYouUpdate} = require('why-did-you-update');
    whyDidYouUpdate(React);
  }

const generateClassName = createGenerateClassName()
const app = (
    <BrowserRouter>
        <Provider store={store} >
            <JssProvider generateClassName={generateClassName}>
                <App />
            </JssProvider>
        </Provider>
    </BrowserRouter>
)

unregister();
injectTapEventPlugin();
ReactDOM.render(app, document.getElementById('root'));
