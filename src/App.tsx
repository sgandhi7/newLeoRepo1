// import { InteractionStatus } from '@azure/msal-browser';
// import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import React from 'react';
import { Route, Routes } from 'react-router';
// import { useRecoilState } from 'recoil';
import { Sidebar } from './components/sidebar/sidebar';
import { Investigation } from './pages/chatwindow';
import { Dashboard } from './pages/dashboard';
import { Examples } from './pages/examples';
import { Faqs } from './pages/faqs';
import { History } from './pages/history';
// import { SignIn } from './pages/sign-in';
// import { currentUser } from './store';
// import { User } from './types/user';

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
export const App = (): React.ReactElement => {
  /*
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [user] = useRecoilState<User | undefined>(currentUser);
  useEffect(() => {
    if (
      !isAuthenticated &&
      inProgress === InteractionStatus.None &&
      user === undefined
    ) {
      navigate('/login');
    }
    console.log('isAuthenticated: ', isAuthenticated);
  }, [inProgress, isAuthenticated, navigate, user]);
 */
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      {/* {user !== undefined ? ( */}
      <main id="mainSection" className="usa-section">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session" element={<Investigation />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      {/* ) : (
        <Routes>
          <Route path="/login" element={<SignIn />} />
        </Routes>
      )} */}
    </div>
  );
};
