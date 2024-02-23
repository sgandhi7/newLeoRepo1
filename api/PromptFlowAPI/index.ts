import { Context, HttpRequest, HttpResponse } from '@azure/functions';

// Define the interfaces
export interface PromptFlow {}

export interface Root {
  query: string;
  chat_history: object[];
}

// Function signature (assuming HTTP trigger)
export async function run(
  context: Context,
  req: HttpRequest,
): Promise<HttpResponse> {
  // Get the request body
  const body: Root = JSON.parse(req.body);

  // Implement your logic here and populate the response object

  // Replace the following with your C# logic translated to TypeScript
  const url =
    'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score';
  const apiKey = '5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct';

  if (!apiKey) {
    throw new Error('A key is required to invoke the endpoint');
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${apiKey}`);
  headers.set('azureml-model-deployment', 'dvasquez-seattle-vcqoi-3');

  try {
    const request = new Request(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();

    return context.res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return context.res.status(500).json({ message: 'Internal Server Error' });
  }
}
