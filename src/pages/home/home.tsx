import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUser } from 'src/store';

export const Home = (): React.ReactElement => {
  const [, setUser] = useRecoilState<string>(currentUser);

  module.exports = async function (
    context: { res: { body: { clientPrincipal: JSON } } },
    req: { headers: { get: (arg0: string) => string } },
  ) {
    const header = req.headers.get('x-ms-client-principal');
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');

    setUser(JSON.parse(decoded)['userDetails']);
    context.res = {
      body: {
        clientPrincipal: JSON.parse(decoded),
      },
    };
  };

  async function getUser() {
    const response = await fetch('/api/user');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }

  useEffect(() => {
    getUser;
  });

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col">
          <h1>Welcome {useRecoilValue(currentUser)}</h1>
        </div>
      </div>
    </div>
  );
};
