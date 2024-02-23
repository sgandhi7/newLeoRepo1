import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import fetch from 'node-fetch';

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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'azureml-model-deployment': 'dvasquez-seattle-vcqoi-3',
      } as HeadersInit,
      body: JSON.stringify(req.body),
    });

    context.res = {
      status: response.status,
      body: response.body,
    };
  } catch (error) {
    context.log.error(`Error calling the API: ${error.message}`);
    context.res = {
      status: 500,
      body: 'Internal server error',
    };
  }
};

export default PromptFlowAPI;
