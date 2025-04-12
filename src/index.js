import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './antd-styles';
import App from './App';

// Set favicon for browser window during development
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = './icon.ico';
document.head.appendChild(favicon);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
