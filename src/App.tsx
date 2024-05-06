import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes } from 'react-router';
import { Header } from './components/header/header';
import { Investigation } from './pages/chatwindow/chatwindow';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';

const queryClient = new QueryClient();

export const App = (): React.ReactElement => (
  <QueryClientProvider client={queryClient}>
    <div>
      <Header />
      <main id="mainSection" className="usa-section">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investigations" element={<Investigation />} />
        </Routes>
      </main>
    </div>
  </QueryClientProvider>
);
