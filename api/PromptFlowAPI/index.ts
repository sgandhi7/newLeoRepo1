import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const PromptFlowAPI: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const url =
    'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score';
  const apiKey = '5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct';

  if (!apiKey) {
    throw new Error('A key should be provided to invoke the endpoint');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'azureml-model-deployment': 'dvasquez-seattle-vcqoi-3',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      const data = await response.json();
      context.res = {
        status: response.status,
        body: data,
      };
    } else {
      context.res = {
        status: response.status,
        body: 'Internal server error',
      };
    }
  } catch (error) {
    context.log.error(`Error calling the API: ${error.message}`);
    context.res = {
      status: 500,
      body: 'Internal server error',
    };
  }
};

export default PromptFlowAPI;
