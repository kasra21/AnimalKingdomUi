import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

ReactDOM.render(
   (
     <BrowserRouter>
       <App />
     </BrowserRouter>
  ),
  document.getElementById('root')
);

registerServiceWorker();
