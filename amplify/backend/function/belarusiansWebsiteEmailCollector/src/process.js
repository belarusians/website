const aws = require("aws-sdk");

exports.saveEmail = function (email) {
  const s3 = new aws.S3();
  const Key = randomString(20);
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: email,
    ContentType: "text/plain",
  };
  return s3.putObject(params).promise();
};

exports.isEmailValid = function (email) {
  if (typeof email !== "string") {
    return false;
  }

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// copilot
function randomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
