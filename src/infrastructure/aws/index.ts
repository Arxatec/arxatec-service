import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_KEY_ACCESS,
  AWS_KEY_ACCESS_SECRET,
} from "../../config/env";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION || "us-east-1",
  credentials: {
    accessKeyId: AWS_KEY_ACCESS || "AKIAV2345678901234567890",
    secretAccessKey:
      AWS_KEY_ACCESS_SECRET || "1234567890123456789012345678901234567890",
  },
});

export const getUrl = (key: string) => {
  return (
    "https://" +
    AWS_BUCKET_NAME +
    ".s3." +
    AWS_BUCKET_REGION +
    ".amazonaws.com/" +
    key
  );
};

export async function uploadFile(
  file: Express.Multer.File,
  pathPrefix: string
) {
  let fileBody: Buffer | fs.ReadStream;
  let originalFileName: string;
  let mimeType: string;

  if (file.buffer) {
    fileBody = file.buffer;
    originalFileName = file.originalname;
    mimeType = file.mimetype;
  } else if (file.path) {
    fileBody = fs.createReadStream(file.path);
    originalFileName = file.originalname;
    mimeType = file.mimetype;
  } else {
    throw new Error("The Multer file object does not contain buffer or path.");
  }

  const uniqueId = uuidv4();
  const fileExtension = path.extname(originalFileName);
  const newFileName = `${uniqueId}${fileExtension}`;
  const createKey = `${pathPrefix}/${newFileName}`;

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Body: fileBody,
    Key: createKey,
    ContentType: mimeType,
  };
  const command = new PutObjectCommand(uploadParams);
  const response = await s3Client.send(command);
  return {
    response,
    key: createKey,
    url: getUrl(createKey),
  };
}

export async function getSignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await awsGetSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });
  return await s3Client.send(command);
}