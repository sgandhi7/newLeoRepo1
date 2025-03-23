import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import fetch from 'node-fetch';

const PromptFlowAPI: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const url = 'https://mss-leo-prod-vcqoi.eastus.inference.ml.azure.com/score';
  const apiKey = 'G2qOjMVNtLtZlSRCxft6jXeA8nXk88za';

  if (!apiKey) {
    throw new Error('A key should be provided to invoke the endpoint');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'azureml-model-deployment': 'mss-leo-prod-vcqoi-1',
      } as HeadersInit,
      body: JSON.stringify(req.body),
    });
    const responseBody = await response.json();

    context.res = {
      status: response.status,
      body: responseBody,
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
