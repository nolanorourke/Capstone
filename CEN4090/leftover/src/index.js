import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App'; // Adjust the import path based on your project structure
import './app/styles/globals.css'; // Assuming you have global styles to include

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);