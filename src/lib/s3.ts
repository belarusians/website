import { S3, config } from "aws-sdk";
import { VacancyApplication } from "./vacancies";

export async function saveEmail(email: string) {
  if (!process.env.S3_BUCKET) {
    throw new Error("S3_BUCKET env variable should be set");
  }

  if (!process.env.ACCESS_KEY_AWS || !process.env.SECRET_KEY_AWS || !process.env.REGION_AWS) {
    throw new Error("AWS credentials variable should be set");
  }

  config.update({
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
    region: process.env.REGION_AWS,
    signatureVersion: "v4",
  });

  const s3 = new S3();
  const Key = randomString(20);
  const params: S3.Types.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: email,
    ContentType: "text/plain",
  };

  return s3.putObject(params).promise();
}

export async function saveVacancyApplication({ contact, additionalInfo, id }: VacancyApplication) {
  if (!process.env.S3_VACANCY_BUCKET) {
    throw new Error("S3_VACANCY_BUCKET env variable should be set");
  }

  if (!process.env.ACCESS_KEY_AWS || !process.env.SECRET_KEY_AWS || !process.env.REGION_AWS) {
    throw new Error("AWS credentials variable should be set");
  }

  config.update({
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
    region: process.env.REGION_AWS,
    signatureVersion: "v4",
  });

  const s3 = new S3();
  const Key = randomString(20);
  const params: S3.Types.PutObjectRequest = {
    Bucket: process.env.S3_VACANCY_BUCKET,
    Key,
    Body: JSON.stringify({ contact, additionalInfo, id }),
    ContentType: "text/plain",
  };

  return s3.putObject(params).promise();
}

// copilot
function randomString(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
