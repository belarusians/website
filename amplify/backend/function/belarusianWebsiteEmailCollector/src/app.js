/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	S3_BUCKET
Amplify Params - DO NOT EDIT */

const express = require("express");
const bodyParser = require("body-parser");
const { saveEmail, isEmailValid } = require("./process");

// declare a new express app
const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "belarusians.nl");
  // res.header("Access-Control-Allow-Headers", "belarusians.nl");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

function sendError(res, statusCode, message, reason = undefined) {
  return res.status(statusCode).json({ message, reason });
}

function sendSuccess(res, message = undefined) {
  return res.status(200).json({ message });
}

app.post("/subscribe", function (req, res) {
  if (!req || !req.body || !req.body.email) {
    return sendError(res, 400, "Bad Request", "Request body is missing email");
  }

  const { email } = req.body;
  if (!isEmailValid(email)) {
    return sendError(res, 400, "Bad Request", "Email is not valid");
  }

  saveEmail(email)
    .then(() => {
      return sendSuccess(res, "Subscribed");
    })
    .catch((e) => {
      console.error(e);
      return sendError(res, 500, "Internal Server Error", "Failed to subscribe");
    });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
