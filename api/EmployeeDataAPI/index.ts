import { AzureFunction, Context } from '@azure/functions';
import fetch from 'node-fetch';

// Define an interface to represent the structure of Employee objects
interface Employee {
  mss_name: string;
  mss_workemail: string;
}

const fetchEmployeeData: AzureFunction = async function (
  context: Context,
): Promise<void> {
  // SAS token for authenticated access to the Azure Blob Storage
  const sasToken =
    'sp=r&st=2024-06-05T14:31:58Z&se=2025-06-05T22:31:58Z&spr=https&sv=2022-11-02&sr=c&sig=9djtlnqXhTLWw01V20Q1eD48Lx8CJhaC7mWpz6mGTOA%3D';
  // URL of the JSON file in Azure Blob Storage, including SAS token
  const url =
    'https://jorgestorageblob.blob.core.windows.net/people/people.json?' +
    sasToken;

  try {
    console.log('Start of azure function');

    // Fetch data from the specified URL using GET method
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    // Parse the response as JSON
    const data: unknown = await response.json();

    // Runtime type check to ensure 'data' is an array of Employee objects
    /* Expected structure of data:
       [
        {
          "mss_name": "test1",
          "mss_workemail": "test1@domain.com",
          "mss_number": 0,
          "mss_bamboohrid": "0"
        },
        ...
       ]
    */
    if (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item.mss_name === 'string' &&
          (typeof item.mss_workemail === 'string' ||
            item.mss_workemail === null) &&
          typeof item.mss_number === 'number' &&
          (typeof item.mss_bamboohrid === 'string' ||
            item.mss_bamboohrid === null),
      )
    ) {
      // Safely assert that 'data' is of type Employee[]
      const employees: Employee[] = data as Employee[];

      // Prepare the response object with structured data
      context.res = {
        body: {
          jsonData: data,
          names: employees.map((item) => item.mss_name), // Extract names
          emails: employees.map((item) => item.mss_workemail || 'N/A'), // Extract emails, fallback to 'N/A'
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {
      // Throw an error if data format is incorrect
      throw new Error('Data format is incorrect');
    }
  } catch (error) {
    // Handle errors, set response status and error message
    const statusCode = error.response?.status || 500; // Default to 500 if no status code
    context.res = {
      status: statusCode,
      body: `Failed to fetch employee data: ${error.message}`, // Error message
    };
  }
};

export default fetchEmployeeData;
