import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { App } from './App.tsx';
import './styles.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter basename={process.env.APP_BASE_URL}>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);
