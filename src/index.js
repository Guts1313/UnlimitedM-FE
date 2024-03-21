import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // This line imports the main stylesheet
import App from './App'; // This line imports your main App component

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);