import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Switch from 'src/components/Switch/Switch.tsx';
//import ToggleSwitch from './components/ToggleSwitch.tsx';

export const Home = (): React.ReactElement => {
  const [setUser] = useState(Object);
  let leoImage = '/img/leo.png'; //Initialize leo image
  let modePref; //Holds user preference for light/dark mode

  // Update modePref based on the data-theme attribute
  if (document.documentElement.getAttribute('data-theme') == 'dark') {
    modePref = true;
  } else {
    modePref = false;
  }
  const [dark, setDark] = useState(modePref);

  // Update the leo image depending on lighting mode
  if (dark) {
    leoImage = '/img/LeoWhitePNG.png';
  } else {
    leoImage = '/img/LeoBlackPNG.png';
  }

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

  // Get user info
  useEffect(() => {
    getUserInfo();
  });

  async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    if (clientPrincipal == null) {
      window.location.reload();
    } else {
      setUser(clientPrincipal);
    }
  }

  return (
    <div className="grid-container" style={{ textAlign: 'center' }}>
      <div className="grid-row">
        <div className="grid-col">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                width: '50%',
                position: 'relative',
                textAlign: 'right',
              }}
            >
              Welcome to <span style={{ color: '#18aee4' }}>Leo</span>,
              MetroStar's <span style={{ color: '#18aee4' }}>AI</span>{' '}
              Assisstant
            </h1>
            <img
              className="chatbot-icon"
              src={leoImage}
              width={512}
              height={512}
              style={{ float: 'right' }}
            ></img>
          </div>
          <div>
            <div className="button-container">
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h2> Dark mode </h2>
                <Switch isOn={dark} handleToggle={changeLightMode(!dark)} />
              </span>
              <NavLink
                id="dashboard-link"
                to="/"
                className={`usa-nav__link ${
                  location.pathname === '/' ? 'usa-current' : ''
                }`}
              >
                <button className="helper-button">
                  <b> Continue to Copilot </b>
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
