import { PublicClientApplication } from '@azure/msal-browser';
import { app, authentication } from '@microsoft/teams-js';
import { User } from '@src/types/user';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from 'src/store';

export const SignIn = (): React.ReactElement => {
  const [user, setUser] = useRecoilState<User | undefined>(currentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const msalConfig = useMemo(
    () => ({
      auth: {
        clientId: process.env.REACT_APP_AZURE_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
        redirectUri: '/',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
      },
      system: {
        allowNativeBroker: false, // Disables WAM Broker
      },
    }),
    [],
  );

  const msalInstance = useMemo(
    () => new PublicClientApplication(msalConfig),
    [msalConfig],
  );

  const handleAuthenticationSuccess = useCallback(
    async (accessToken: string) => {
      console.log('Authentication successful, calling graph from web...');
      const userInfo = await getUserInfoFromGraph(accessToken);
      setUser(userInfo);
    },
    [setUser],
  );

  const authenticateOnWeb = useCallback(async () => {
    try {
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        const silentResult = await msalInstance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: accounts[0],
        });
        await handleAuthenticationSuccess(silentResult.accessToken);
      } else {
        await msalInstance.loginRedirect({
          scopes: ['User.Read'],
        });
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }, [msalInstance, navigate, handleAuthenticationSuccess]);

  const authenticateInTeams = useCallback(async () => {
    try {
      // Get client-side token
      const token = await authentication.getAuthToken();
      // Exchange client-side token for server-side token
      const serverToken = await exchangeTokenForServerToken(token);
      const userInfo = await getUserInfoFromGraph(serverToken);
      setUser(userInfo);
    } catch (error) {
      console.error('Error during Teams SSO:', error);
      await authenticateOnWeb();
    }
  }, [setUser, authenticateOnWeb]);

  const initializeTeamsApp = async () => {
    return Promise.race([
      app.initialize(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Teams SDK initialization timed out')),
          10000,
        ),
      ),
    ]);
  };

  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        console.log('Handling redirect promise...');
        await msalInstance.initialize();
        const result = await msalInstance.handleRedirectPromise();
        console.log('RedirectPromise result:', result);
        if (result) {
          await handleAuthenticationSuccess(result.accessToken);
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };

    async function initializeUser() {
      if (!user && !isAuthenticating) {
        setIsAuthenticating(true);
        console.log('Starting authentication...');
        try {
          const isInTeams = await initializeTeamsApp()
            .then(() => app.getContext())
            .catch(() => false);
          console.log(isInTeams);
          if (isInTeams) {
            console.log('Running in Teams');
            await authenticateInTeams();
          } else {
            console.log('Running in web');
            await authenticateOnWeb();
          }
        } catch (error) {
          console.error('Authentication error:', error);
        } finally {
          setIsAuthenticating(false);
          navigate('/');
        }
      }
    }
    if (!user && !isAuthenticating) {
      handleRedirectPromise().then(() => initializeUser());
    }
  }, [
    user,
    isAuthenticating,
    navigate,
    authenticateInTeams,
    authenticateOnWeb,
    msalInstance,
    handleAuthenticationSuccess,
  ]);

  // useEffect(() => {}, [msalInstance, handleAuthenticationSuccess]);

  async function getUserInfoFromGraph(accessToken: string): Promise<User> {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        method: 'GET',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return {
      firstName: data.givenName || '',
      lastName: data.surname || '',
      displayName: data.displayName || '',
      emailAddress: data.mail || data.userPrincipalName || '',
      phoneNumber: data.mobilePhone || '',
    };
  }

  async function exchangeTokenForServerToken(
    clientSideToken: string,
  ): Promise<string> {
    const response = await fetch('/api/getProfileOnBehalfOf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: clientSideToken, // Send the token as a JSON object
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange token');
    }

    const data = await response.json();
    return data.accessToken;
  }

  if (isAuthenticating) {
    return <div style={{ paddingLeft: '100px' }}>Authenticating...</div>;
  }

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6" style={{ paddingLeft: '100px' }}>
          <h1>Sign In</h1>
          {/* TODO: Improve UI */}
        </div>
      </div>
    </div>
  );
};
