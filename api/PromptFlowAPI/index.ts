import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as https from 'https';

interface ChatHistoryItem {
  inputs: Inputs;
  outputs: Outputs;
}

interface Inputs {
  query: string;
}

interface Outputs {
  current_query_intent: string;
  fetched_docs: string[];
  output_entities: string;
  reply: string;
  search_intents: string;
}

interface Root {
  query: string;
  chat_history: ChatHistoryItem[];
}

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

  const bodyContent = JSON.stringify(req.body);
  const encodedBody = Buffer.from(bodyContent, 'utf-8');

  const options = {
    method: 'POST',
    headers: headers,
  };

  const responseData = [];
  const request = https.request(url, options, (response) => {
    response.on('data', (chunk) => {
      responseData.push(chunk);
    });
    response.on('end', () => {
      const resultJson = JSON.parse(Buffer.concat(responseData).toString());
      const rootObject: Root = {
        query: req.body.query,
        chat_history: [
          {
            inputs: { query: req.body.query },
            outputs: {
              current_query_intent: resultJson.current_query_intent,
              fetched_docs: resultJson.fetched_docs,
              output_entities: resultJson.output_entities,
              reply: resultJson.reply,
              search_intents: resultJson.search_intents,
            },
          },
        ],
      };
      context.res = {
        status: 200,
        body: rootObject,
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
