import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes } from 'react-router';
import { Header } from './components/header/header';
import { Investigation } from './pages/chatwindow/chatwindow';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';

const queryClient = new QueryClient();

/*
  For Dark mode handling on entrance of the App
  1. Check if the user has dark mode enabled for their browser
  2. Check if the user has already chosen a preference for Leo Dark Mode (stored in local storage)
    1. If they do, overwrite the browser preference and set the attribute of the document to light/dark
    2. Based on the definition in styles.scss, the page will update accordingly
*/
const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersDarkMode = localStorage.getItem('prefersDarkMode');
let modePref = defaultDark;
if (prefersDarkMode) {
  modePref = prefersDarkMode === 'true';
}
document.documentElement.setAttribute(
  'data-theme',
  modePref ? 'dark' : 'light',
);

// Export the App
export const App = (): React.ReactElement => (
  <QueryClientProvider client={queryClient}>
    <div>
      <Header />
      <main id="mainSection" className="usa-section">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/investigations" element={<Investigation />} />
        </Routes>
      </main>
    </div>
  </QueryClientProvider>
);
