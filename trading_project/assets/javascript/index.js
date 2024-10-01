// import _ from 'lodash';

// function component() {
//   const element = document.createElement('div');
//   element.innerHTML =  _.join(['Hello', 'lodash'], ' ');
//   return element;
// }
// document.body.appendChild(component());

// import React from 'react';
// import ReactDOM from 'react-dom/client';  // Import from react-dom/client in React 18+

// // Create a root using createRoot
// const root = ReactDOM.createRoot(document.getElementById('root'));

// // Render your component
// root.render(
//   <h1>Hello, react!</h1>
// );

// assets/javascript/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // base.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
