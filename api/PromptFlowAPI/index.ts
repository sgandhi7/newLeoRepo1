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

  // const encodedBody = Buffer.from(req.body);

  const options = {
    method: 'POST',
    headers: headers,
  };

  const request = https.request(url, options, (response) => {
    let responseBody = '';
    response.on('data', (chunk) => {
      // Concatenate each chunk of data
      responseBody += chunk;
    });
    response.on('end', () => {
      try {
        // Parse the entire response data directly into a JavaScript object
        const resultJson = JSON.parse(responseBody);
        context.res = {
          status: 200,
          body: resultJson,
        };
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // Handle the error if JSON parsing fails
      }
    });
  });

  request.on('error', (error) => {
    context.res = {
      status: 500,
      body: error.message,
    };
  });

  request.write(JSON.stringify(req.body));
  request.end();
};

export default httpTrigger;
