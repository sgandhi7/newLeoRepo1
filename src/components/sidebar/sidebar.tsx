import { Button, Icon } from '@metrostar/comet-uswds';
import { User } from '@src/types/user';
import { APP_TITLE } from '@src/utils/constants';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from 'src/store';
import Switch from '../Switch/Switch';

export const Sidebar = (): React.ReactElement => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useRecoilState<User | undefined>(currentUser);
  const leoImage = '/img/leo.png'; //Initialize leo image
  let modePref; //Holds user preference for light/dark mode

  // Get user info
  if (user === undefined) {
    console.log('Sidebar: User is undefined');
    getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });
    console.log('User info:', user);
  }

  async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    console.log('Client Principal', clientPrincipal);
    if (clientPrincipal) {
      const newUser = {
        firstName: '',
        lastName: '',
        displayName: '',
        emailAddress: clientPrincipal.userDetails,
        phoneNumber: '',
      };
      for (const claim of clientPrincipal.claims) {
        if (claim.typ === 'name') {
          newUser.displayName = claim.val;
          newUser.firstName = claim.val.split(/\s+/)[0];
          newUser.lastName = claim.val.split(/\s+/)[1];
        }
      }
      return newUser;
    }
  }

  // Update modePref based on the data-theme attribute
  if (document.documentElement.getAttribute('data-theme') == 'dark') {
    modePref = true;
  } else {
    modePref = false;
  }
  const [dark, setDark] = useState(modePref);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  //Updates the value of 'dark', then sets the document attribute and preferred mode in local storage accordingly
  function changeLightMode(
    setIsDark: boolean | ((prevState: boolean) => boolean),
  ) {
    return () => {
      setDark(setIsDark);
      document.documentElement.setAttribute(
        'data-theme',
        setIsDark ? 'dark' : 'light',
      );
      if (setIsDark) {
        localStorage.setItem('prefersDarkMode', 'true');
      } else {
        localStorage.setItem('prefersDarkMode', 'false');
      }
    };
  }

  return (
    <nav id="sidebar-nav">
      {/* {isSignedIn ? ( */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div
          className={`width-full display-flex flex-column padding-top-1 ${
            isOpen ? 'flex-align-start' : 'flex-align-end'
          }`}
        >
          <div className="sidebar-btn-group">
            <Button
              id="home-btn"
              variant="unstyled"
              onClick={() => navigate('/')}
              style={{ marginRight: '5px', marginLeft: '5px' }}
            >
              {isOpen ? (
                <>
                  <div style={{ display: 'flex' }}>
                    <img
                      className="chatbot-logo"
                      src={leoImage}
                      alt="Leo Logo"
                      height={50}
                      width={50}
                      style={{ marginLeft: '-1px' }}
                    />
                    <em
                      className="usa-logo__text"
                      style={{
                        fontSize: '35px',
                        height: '52px',
                        color: 'white',
                        marginLeft: '10px',
                        marginTop: '8px',
                      }}
                    >
                      {APP_TITLE}
                    </em>
                  </div>
                </>
              ) : (
                <img
                  className="chatbot-logo"
                  src={leoImage}
                  alt="Leo Logo"
                  height={50}
                  style={{ marginLeft: '3px' }}
                />
              )}
            </Button>
            <div>
              <Button
                id="toggle-btn"
                variant="unstyled"
                aria-label="collapse"
                onClick={toggleSidebar}
              >
                <Icon
                  id="expand-collapse-icon"
                  type={isOpen ? 'navigate_far_before' : 'navigate_far_next'}
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">Collapse</span>
                ) : (
                  <></>
                )}
              </Button>
            </div>
          </div>
          <hr className="width-full" />
          <div className="sidebar-btn-group">
            {/* <div>
              <Button
                id="copilot-btn"
                variant="unstyled"
                aria-label="copilot"
                onClick={() => navigate('/')}
              >
                <Icon
                  id="copilot-icon"
                  type="forum"
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">Copilot</span>
                ) : (
                  <></>
                )}
              </Button>
            </div> */}
            <div>
              <Button
                id="history-btn"
                variant="unstyled"
                aria-label="history"
                onClick={() => navigate('/history')}
              >
                <Icon
                  id="history-icon"
                  type="history"
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">History</span>
                ) : (
                  <></>
                )}
              </Button>
            </div>
            <div>
              <Button
                id="faqs-btn"
                variant="unstyled"
                aria-label="frequently asked questions"
                onClick={() => navigate('/faqs')}
              >
                <Icon
                  id="faqs-icon"
                  type="help_outline"
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">FAQs</span>
                ) : (
                  <></>
                )}
              </Button>
            </div>
            <div>
              <Button
                id="examples-btn"
                variant="unstyled"
                aria-label="example prompts"
                onClick={() => navigate('/examples')}
              >
                <Icon
                  id="examples-icon"
                  type="list"
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">
                    Example Prompts
                  </span>
                ) : (
                  <></>
                )}
              </Button>
            </div>
            <div>
              <Button
                id="feedback-btn"
                variant="unstyled"
                aria-label="feedback"
                onClick={() =>
                  window.open(
                    'https://loop.cloud.microsoft/p/eyJ3Ijp7InUiOiJodHRwczovL21ldHJvc3RhcnN5cy5zaGFyZXBvaW50LmNvbS8%2FbmF2PWN6MGxNa1ltWkQxaUlXaDBRV1pYVkVSYU1EQnRUVkV3Vld4UFlqZFZjRXQwVVU1bFUxcFFWMmhEZEZCZmFETnhibFIxWlZRM2MzTkxlR3h5WnpWVVlUUlJhWFZJWjJwYWRXUW1aajB3TVRKWVdGazBWa2xSVmtjMFZqTkZWRUZhU2tKSlVrZFRVa1JTTlZsUlYxWmFKbU05Sm1ac2RXbGtQVEUlM0QiLCJyIjpmYWxzZX0sInAiOnsidSI6Imh0dHBzOi8vbWV0cm9zdGFyc3lzLnNoYXJlcG9pbnQuY29tL2NvbnRlbnRzdG9yYWdlL0NTUF81OTFmZDA4Ni1kOTMwLTQ5ZDMtOGM0My00NTI1MzliZWQ0YTQvRG9jdW1lbnQlMjBMaWJyYXJ5L0xvb3BBcHBEYXRhL0ZlZWRiYWNrJTIwMS5sb29wP25hdj1jejBsTWtaamIyNTBaVzUwYzNSdmNtRm5aU1V5UmtOVFVGODFPVEZtWkRBNE5pMWtPVE13TFRRNVpETXRPR00wTXkwME5USTFNemxpWldRMFlUUW1aRDFpSVdoMFFXWlhWRVJhTURCdFRWRXdWV3hQWWpkVmNFdDBVVTVsVTFwUVYyaERkRkJmYUROeGJsUjFaVlEzYzNOTGVHeHlaelZVWVRSUmFYVklaMnBhZFdRbVpqMHdNVEpZV0ZrMFZrbFZWRE5HUlVkRFdreEpUa2d5V0RKRVJFeEpUVlJFTTA1UEptTTlKVEpHSm1ac2RXbGtQVEUlM0QiLCJyIjpmYWxzZX0sImkiOnsiaSI6ImQwNDQ0NDU5LTAwOWUtNDc3NC04M2U1LTJmMzAxNGY1MWI5YyJ9fQ%3D%3D',
                    '_blank',
                  )
                }
              >
                <Icon
                  id="examples-icon"
                  type="chat"
                  className="text-white"
                  size="size-4"
                />
                {isOpen ? (
                  <span className="sidebar-text text-white">Feedback</span>
                ) : (
                  <></>
                )}
              </Button>
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <Switch isOn={dark} handleToggle={changeLightMode(!dark)} />
              {isOpen ? (
                <span
                  className="sidebar-text text-white"
                  style={{ top: '1px', left: '18px' }}
                >
                  Dark Mode
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="sidebar-profile">
            {user ? (
              <div
                className="sidebar-profile-avatar"
                style={{ marginBottom: '1rem' }}
              >
                <span className="sidebar-profile-initials">
                  {user.firstName?.charAt(0)?.toUpperCase()}
                  {user.lastName?.charAt(0).toUpperCase()}
                </span>
                {isOpen ? (
                  <>
                    <span className="sidebar-profile-name text-white">
                      {user.displayName}
                    </span>
                  </>
                ) : (
                  <></>
                )}
                {/* <div style={{ marginLeft: '-15px', marginTop: '10px' }}>
                  <Button
                    id="signout-btn"
                    variant="unstyled"
                    aria-label="sign out"
                    onClick={() => navigate('/signout')}
                  >
                    <Icon
                      id="signout-icon"
                      type="logout"
                      className="text-white"
                      size="size-4"
                    />
                    {isOpen ? (
                      <span className="sidebar-text text-white">Sign Out</span>
                    ) : (
                      <></>
                    )}
                  </Button>
                </div> */}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
