// import { app, HttpRequest, InvocationContext } from '@azure/functions';
// import axios from 'axios';

// export async function httpTrigger1(
//   request: HttpRequest,
//   context: InvocationContext,
// ): AxiosResponse<any, any> {
//   const instance = axios.create({
//     withCredentials: true,
//     baseURL: process.env.API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//       // eslint-disable-next-line prettier/prettier
//       'Authorization': process.env.API_KEY,
//       'azureml-model-deployment': 'dvasquez-seattle-vcqoi-2',
//       'Access-Control-Allow-Origin': '*',
//     },
//   });
//   context.log('HTTP trigger function processed a request.');

//   const response = await instance.post('/score', request);

//   return response;
// }

// app.http('httpTrigger1', {
//   methods: ['POST'],
//   authLevel: 'anonymous',
//   handler: httpTrigger1,
// });

// export default httpTrigger1;
