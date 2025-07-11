import { env } from "@/env";

export function useConstructUrl(key: string) {
  return `https://${env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;
}
