const { app } = require('@azure/functions');

module.exports = async function (context, req) {
  const https = require('https');

  const url = "https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score";
  const apiKey = "5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct";

  if (!apiKey) {
      throw new Error("A key should be provided to invoke the endpoint");
  }

  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'azureml-model-deployment': 'dvasquez-seattle-vcqoi-3'
  };

  const bodyContent = JSON.stringify(req.body);

  try {
      const options = {
          method: 'POST',
          headers: headers
      };

      const response = await new Promise((resolve, reject) => {
          const req = https.request(url, options, (res) => {
              let data = '';

              res.on('data', (chunk) => {
                  data += chunk;
              });

              res.on('end', () => {
                  resolve({
                      statusCode: res.statusCode,
                      body: data
                  });
              });
          });

          req.on('error', (error) => {
              reject(error);
          });

          req.write(bodyContent);
          req.end();
      });

      const resultJson = JSON.parse(response.body);
      context.res = {
          status: response.statusCode,
          body: resultJson
      };
  } catch (error) {
      context.res = {
          status: 500,
          body: error.message
      };
  }
};
