import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import axios from 'axios';

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

  try {
    const bodyContent = req.body;
    const response = await axios.post(url, bodyContent, { headers });
    const resultJson = response.data;

    // Format response to match C# output structure
    const rootObject: Root = {
      query: bodyContent.query,
      chat_history: [
        {
          inputs: { query: bodyContent.query },
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
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
};

export default httpTrigger;
