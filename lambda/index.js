const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
AWS.config.update({ region: "us-east-2" });

const dynamoClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event, context) {
  try {

    const fetch = (await import('node-fetch')).default;

    // Hacer una solicitud GET a la API de Chuck Norris
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();

    const requestId = uuidv4();
    const params = {
      TableName: "test-execersiste",
      Item: {
        id_request: requestId,
        joke: data.value
      }
    };
    await dynamoClient.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.value }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al procesar la solicitud" }),
    };
  }
};
