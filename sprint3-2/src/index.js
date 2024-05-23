import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import { NotificationProvider } from './component/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <NotificationProvider>
        <App />
    </NotificationProvider>
);

reportWebVitals();

