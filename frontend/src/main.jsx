import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import App from './app';
import store from './store/store'
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);