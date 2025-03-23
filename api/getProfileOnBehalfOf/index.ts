import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ConfidentialClientApplication } from '@azure/msal-node';

const getProfileOnBehalfOf: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
  const clientId = process.env.REACT_APP_AZURE_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_AZURE_CLIENT_SECRET;
  const token = req.body?.token;

  if (!tenantId || !clientId || !clientSecret || !token) {
    context.res = {
      status: 400,
      body: 'Missing required parameters.',
    };
    return;
  }

  const msalConfig = {
    auth: {
      clientId: clientId as string,
      clientSecret: clientSecret as string,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
  };

  const msalClient = new ConfidentialClientApplication(msalConfig);

  try {
    const result = await msalClient.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: ['https://graph.microsoft.com/User.Read'],
      skipCache: true,
    });

    context.res = {
      status: 200,
      body: {
        accessToken: result.accessToken,
      },
    };
  } catch (error) {
    context.log('Error during token exchange:', error);
    context.res = {
      status: 500,
      body: {
        error: 'Token exchange failed',
        details: error.message,
      },
    };
  }
};

export default getProfileOnBehalfOf;
