import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import { unregister } from './registerServiceWorker'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { JssProvider } from 'react-jss'
import {createGenerateClassName} from './generateclassname'


let  basename = ""
if (process.env.NODE_ENV !== 'production') {
    const {whyDidYouUpdate} = require('why-did-you-update');
    //whyDidYouUpdate(React);
    basename = "musicvid.org"
}

const generateClassName = createGenerateClassName()
const app = (
    <BrowserRouter >
        <Provider store={store} >
            <JssProvider generateClassName={generateClassName}>
                <App />
            </JssProvider>
        </Provider>
    </BrowserRouter>
)

unregister();
ReactDOM.render(app, document.getElementById('root'));
