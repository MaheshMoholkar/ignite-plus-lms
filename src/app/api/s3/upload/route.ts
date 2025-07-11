import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "@/lib/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
  file: z.string().min(1, { message: "File is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

export async function POST(request: NextRequest) {
  await requireAdmin();

  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: z.treeifyError(validation.error) },
        { status: 400 }
      );
    }

    const { file, contentType, size } = validation.data;

    const key = `${uuidv4()}-${file}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: key,
      Body: file,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 6, // 6 min
    });

    const response = {
      presignedUrl,
      key,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
