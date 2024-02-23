import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as http from 'http';
import * as https from 'https';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const url: string =
    'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score';
  const apiKey: string = '5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct';

  if (!apiKey) {
    context.res = {
      status: 400,
      body: 'A key should be provided to invoke the endpoint',
    };
    context.done();
    return;
  }

  const headers: http.OutgoingHttpHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
    'azureml-model-deployment': 'dvasquez-seattle-vcqoi-3',
  };

  const bodyContent: string = req.body ? req.body.toString() : '';
  const body: Buffer = Buffer.from(bodyContent, 'utf-8');

  try {
    const options: https.RequestOptions = {
      method: 'POST',
      headers: headers,
    };

    const request = https.request(url, options, (res) => {
      let responseBody: string = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        const resultJson: Record<string, unknown> = JSON.parse(responseBody);
        context.res = {
          status: 200,
          body: resultJson,
        };
        context.done();
      });
    });

    request.on('error', (error) => {
      context.res = {
        status: 500,
        body: error.message,
      };
      context.done();
    });

    request.write(body);
    request.end();
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    };
    context.done();
  }
};

export default httpTrigger;
