import React from 'react';
import { render } from 'react-dom';
import  { createRoot }  from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import * as bootstrap from 'bootstrap'
import './scss/styles.scss';





const root = createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
   <App />
  </BrowserRouter>
)