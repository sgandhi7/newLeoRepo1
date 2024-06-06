import { Icon } from '@metrostar/comet-uswds';
import { APP_TITLE } from '@src/utils/constants';
import navigation from '@uswds/uswds/js/usa-header';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
// import { useRecoilState } from 'recoil';
// import { signedIn } from 'src/store';

export const Header = (): React.ReactElement => {
  const [showMenu, setShowMenu] = useState(false);
  // const [isSignedIn, setIsSignedIn] = useRecoilState<boolean>(signedIn);
  // const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (): void => {
    window.scrollTo({ top: 0 });
    setShowMenu(!showMenu);
  };

  // Ensure navigation JS is loaded
  useEffect(() => {
    const bodyElement = document.body;
    navigation.on(bodyElement);

    return () => {
      navigation.off(bodyElement);
    };
  });

  useEffect(() => {
    const ref = document.body.style;
    showMenu ? (ref.overflow = 'hidden') : (ref.overflow = 'visible');
  }, [showMenu]);

  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  const handleLogout = (): void => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/logout';
  };

  return (
    <>
      <a className="usa-skipnav " href="#mainSection">
        Skip to main content
      </a>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <img
            className="chatbot-icon"
            src="/img/leo.png"
            width={100}
            height={100}
          ></img>
          <div className="usa-navbar">
            <div className="usa-logo" id="-logo">
              <em
                className="usa-logo__text"
                style={{ fontSize: '35px', height: '52px' }}
              >
                <NavLink id="logo-link" to="/Home">
                  {APP_TITLE}
                </NavLink>
              </em>
            </div>
            <button
              type="button"
              className="usa-menu-btn"
              onClick={handleMenuClick}
            >
              Menu
            </button>
          </div>
          <nav className="usa-nav">
            <button type="button" className="usa-nav__close">
              <Icon id="menu-icon" type="close" />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <NavLink
                  id="home-link"
                  to="/Home"
                  className={`usa-nav__link ${
                    location.pathname === '/Home' ? 'usa-current' : ''
                  }`}
                >
                  Home
                </NavLink>
              </li>
              <li className="usa-nav__primary-item">
                <NavLink
                  id="dashboard-link"
                  to="/"
                  className={`usa-nav__link ${
                    location.pathname === '/' ? 'usa-current' : ''
                  }`}
                >
                  Copilot
                </NavLink>
              </li>
              <li className="usa-nav__primary-item">
                <Link
                  id="auth-link"
                  to="/logout"
                  className={`usa-nav__link ${
                    location.pathname === '/logout' ? 'usa-current' : ''
                  }`}
                  onClick={handleLogout}
                >
                  Sign Out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
