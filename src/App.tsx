import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes } from 'react-router';
import { Sidebar } from './components/sidebar/sidebar';
import { Investigation } from './pages/chatwindow';
import { Dashboard } from './pages/dashboard';
import { Examples } from './pages/examples';
import { Faqs } from './pages/faqs';
import { History } from './pages/history';
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
    <main id="mainSection" className="usa-section">
      <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investigations" element={<Investigation />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </main>
  </QueryClientProvider>
);
