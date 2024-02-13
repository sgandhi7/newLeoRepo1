import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes } from 'react-router';
import { Header } from './components/header/header';
import { ProtectedRoute } from './components/protected-route/protected-route';
import { Investigation } from './pages/chatwindow/chatwindow';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { SignIn } from './pages/sign-in/sign-in';

const queryClient = new QueryClient();

export const App = (): React.ReactElement => (
  <QueryClientProvider client={queryClient}>
    <div>
      <Header />
      <main id="mainSection" className="usa-section">
        <a href="/.auth/login/aad?post_login_redirect_uri=/dashboard">Login</a>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigations" element={<Investigation />} />
            <Route path="/investigations/:id" element={<Investigation />} />
          </Route>
        </Routes>
      </main>
    </div>
  </QueryClientProvider>
);
