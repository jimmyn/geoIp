'use strict';

const request = require('request');

const supportedOrigins = process.env.ORIGINS.split(',');

module.exports.locate = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));
  const origin = event.headers.origin;
  if (!supportedOrigins.includes(origin)) {
    const result = {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Not allowed'
      }),
    };

    callback(null, result);
  }
  const options = {
    method: 'GET',
    url: `https://pro.ip-api.com/json/${event.requestContext.identity.sourceIp}`,
    qs: {key: process.env.API_KEY}
  };

  request(options, function (error, response, body) {
    if (error) callback(error);
    const result = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': true,
      },
      body,
    };

    callback(null, result);
  });
};
