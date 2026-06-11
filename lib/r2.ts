import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const createR2Client = () =>
  new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

let _client: S3Client | null = null;

export const r2 = () => {
  if (!_client) _client = createR2Client();
  return _client;
};

export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
export const R2_PUBLIC_BUCKET = process.env.R2_BUCKET_NAME!;

export const getDownloadUrl = (
  bucket: string,
  key: string,
  expiresIn = 3600,
  options?: { contentDisposition?: string },
) =>
  getSignedUrl(
    r2(),
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ...(options?.contentDisposition
        ? { ResponseContentDisposition: options.contentDisposition }
        : {}),
    }),
    { expiresIn },
  );

export const getUploadUrl = (
  bucket: string,
  key: string,
  options: { contentLength: number; contentType: string; expiresIn?: number },
) =>
  getSignedUrl(
    r2(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentLength: options.contentLength,
      ContentType: options.contentType,
    }),
    { expiresIn: options.expiresIn ?? 3600 },
  );

export const getFile = async (bucket: string, key: string) => {
  const response = await r2().send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  const stream = response.Body;
  if (!stream) throw new Error(`Empty response for ${key}`);
  return Buffer.from(await stream.transformToByteArray());
};

export const downloadFile = async (bucket: string, key: string): Promise<Buffer> => {
  const response = await r2().send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  const stream = response.Body;
  if (!stream) throw new Error(`Empty response for ${key}`);
  return Buffer.from(await stream.transformToByteArray());
};

export const headFile = async (bucket: string, key: string) => {
  const response = await r2().send(
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
  );
  return { contentLength: response.ContentLength ?? 0 };
};

export const uploadFile = (
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string,
) =>
  r2().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

export const deleteFile = (bucket: string, key: string) =>
  r2().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

/** Bulk delete up to 1000 keys per call (R2/S3 limit). Returns keys that failed. */
export const deleteFiles = async (bucket: string, keys: string[]) => {
  if (keys.length === 0) return [];

  const BATCH_SIZE = 1000;
  const failed: string[] = [];

  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const batch = keys.slice(i, i + BATCH_SIZE);
    const result = await r2().send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: batch.map((Key) => ({ Key })),
          Quiet: true,
        },
      }),
    );
    if (result.Errors) {
      for (const err of result.Errors) {
        if (err.Key) failed.push(err.Key);
      }
    }
  }

  return failed;
};

/** Convenience: upload to public bucket and return public URL */
export async function uploadPublic(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: string,
): Promise<string> {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safe}`;
  await uploadFile(R2_PUBLIC_BUCKET, key, buffer, contentType);
  return `${R2_PUBLIC_URL}/${key}`;
}
