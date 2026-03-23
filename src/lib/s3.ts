import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { VacancyApplication } from './vacancies';

function getS3(): S3 {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.REGION_AWS) {
    throw new Error('AWS credentials variable should be set');
  }
  return new S3({
    region: process.env.REGION_AWS,
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
  });
}

export async function saveEmail(email: string) {
  if (!process.env.S3_BUCKET) {
    throw new Error('S3_BUCKET env variable should be set');
  }

  const params: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET,
    Key: crypto.randomUUID(),
    Body: email,
    ContentType: 'text/plain',
  };

  return getS3().putObject(params);
}

export async function saveVacancyApplication({ contact, additionalInfo, id }: VacancyApplication) {
  if (!process.env.S3_VACANCY_BUCKET) {
    throw new Error('S3_VACANCY_BUCKET env variable should be set');
  }

  const params: PutObjectCommandInput = {
    Bucket: process.env.S3_VACANCY_BUCKET,
    Key: crypto.randomUUID(),
    Body: JSON.stringify({ contact, additionalInfo, id }),
    ContentType: 'text/plain',
  };

  return getS3().putObject(params);
}
