import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

export const s3Client = new S3Client({
  endpoint: env.AWS_ENDPOINT_URL_S3,
  region: env.AWS_REGION,
  forcePathStyle: false,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
