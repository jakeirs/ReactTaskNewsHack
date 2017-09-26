import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {PARAM_SEARCH as boo} from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
console.log('boom',boo)

if (module.hot) {
    module.hot.accept()
}
