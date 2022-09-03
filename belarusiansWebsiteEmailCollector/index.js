require("source-map-support/register");
const awsServerlessExpress = require("@vendia/serverless-express");
const app = require("./app");

/**
 * @type {import('http').Server}
 */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = awsServerlessExpress({ app });
