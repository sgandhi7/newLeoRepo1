import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import fetch from 'node-fetch';
// import {
//   ContainerClient,
//   StorageSharedKeyCredential,
// } from '@azure/storage-blob';

// const AZURE_ACCOUNT_NAME = 'mssleoblobs';

// const AZURE_STORAGE_KEY =
//   'woTyLB3DaG8ERv4/0gnNWxGeaGHGRf/XvwL8dciD7zineJIgIc9+SBzI8iXnJ90rBB+AOOmpJfpX+AStfcKvtw==';

// // const blobServiceClient = BlobServiceClient.fromConnectionString(
// //   AZURE_STORAGE_CONNECTION_STRING,
// // );

// const sharedKeyCredential = new StorageSharedKeyCredential(
//   AZURE_ACCOUNT_NAME,
//   AZURE_STORAGE_KEY,
// );

// const baseUrl = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net`;
// const containerName = 'leo-user-sessions';

// // create container from ContainerClient
// const containerClient = new ContainerClient(
//   `${baseUrl}/${containerName}`,
//   sharedKeyCredential,
// );

// // const containerClient =
// //   blobServiceClient.getContainerClient('leo-user-sessions');

// const uploadSession = async (user, session) => {
//   const blockBlobClient = containerClient.getBlockBlobClient(`${user}.json`);
//   const data = JSON.stringify(session);
//   await blockBlobClient.upload(data, data.length);
// };

// const downloadSession = async (user: string): Promise<JSON> => {
//   const blockBlobClient = containerClient.getBlockBlobClient(`${user}.json`);
//   const downloadBlockBlobResponse = await blockBlobClient.download(0);
//   const downloaded = await streamToString(
//     downloadBlockBlobResponse.readableStreamBody,
//   );
//   return JSON.parse(downloaded);
// };

// const streamToString = async (
//   readableStream: NodeJS.ReadableStream,
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     readableStream.on('data', (data) => {
//       chunks.push(data.toString());
//     });
//     readableStream.on('end', () => {
//       resolve(chunks.join(''));
//     });
//     readableStream.on('error', reject);
//   });
// };

const fetchSessions: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  // const user = req.body.user;
  // const action = req.query.action;
  // const session = req.query.session;

  // if (!user || !action) {
  //   context.res = {
  //     status: 400,
  //     body: 'Please provide user and action (upload/pull)',
  //   };
  //   return;
  // }

  // if (action === 'upload' && session) {
  //   await uploadSession(user, session);
  //   context.res = {
  //     status: 200,
  //     body: 'Session uploaded successfully',
  //   };
  // } else if (action === 'pull') {
  //   const sessionData = await downloadSession(user);
  //   context.res = {
  //     status: 200,
  //     body: sessionData,
  //   };
  // } else {
  //   context.res = {
  //     status: 400,
  //     body: 'Invalid action or missing data for upload',
  //   };
  // }
  const url =
    'https://mssresumesync.azurewebsites.net/api/FetchSessions?code=IC9wV523JeN6HqISa6wyD4vVzhre7gWw4YbZ-g3dzD-sAzFu25dVAg%3D%3D';

  try {
    const response = await fetch(url, {
      method: 'POST',
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
      body: { message: 'Internal server error', error: error.message },
    };
  }
};

export default fetchSessions;
