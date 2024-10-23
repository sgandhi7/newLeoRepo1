import { MsalProvider } from '@azure/msal-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { App } from './App.tsx';
import './styles.scss';
import { msalInstance } from './utils/msal.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
