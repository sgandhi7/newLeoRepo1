import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as https from 'https';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const url: string =
    'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score';
  const apiKey: string = '5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct';

  if (!apiKey) {
    throw new Error('A key should be provided to invoke the endpoint');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'azureml-model-deployment': 'dvasquez-seattle-vcqoi-3',
  };

  const encodedBody = Buffer.from(req.body);

  const options = {
    method: 'POST',
    headers: headers,
  };

  const request = https.request(url, options, (response) => {
    let responseBody = Buffer.from([]);
    response.on('data', (chunk) => {
      console.log('Received chunk:', chunk);
      console.log('Type of chunk:', typeof chunk);
      responseBody = Buffer.concat([responseBody, chunk]);
    });
    response.on('end', () => {
      const resultJson = JSON.parse(responseBody.toString());
      context.res = {
        status: 200,
        body: resultJson,
      };
    });
  });

  request.on('error', (error) => {
    context.res = {
      status: 500,
      body: error.message,
    };
  });

  request.write(encodedBody);
  request.end();
};

export default httpTrigger;
