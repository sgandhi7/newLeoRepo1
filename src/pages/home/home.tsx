import React, { useEffect, useState } from 'react';

export const Home = (): React.ReactElement => {
  const [user, setUser] = useState(false);

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
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col">
          <h1>Welcome {user}</h1>
        </div>
      </div>
    </div>
  );
};
