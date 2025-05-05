import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
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

export async function uploadFile(file: any, pathPrefix: string) {
  const fileStream = fs.createReadStream(file.tempFilePath); // Creamos un stream de la imagen
  const uniqueId = uuidv4();
  const fileExtension = path.extname(file.name);
  const newFileName = `${uniqueId}${fileExtension}`;
  const createKey = `${pathPrefix}/${newFileName}`;

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME, // Nombre del bucket
    Body: fileStream, // Stream de la imagen
    Key: createKey, // Key de la imagen
    ContentType: file.mimetype, // Tipo de la imagen
  };
  const command = new PutObjectCommand(uploadParams); // Creamos un comando para subir la imagen
  const response = await s3Client.send(command); // Enviamos el comando
  console.log(response); // Imprimimos la respuesta
  return createKey; // Devolvemos la key de la imagen
}

export async function getSignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME, // Nombre del bucket
    Key: key, // Key de la imagen
  });
  const url = await awsGetSignedUrl(s3Client, command, { expiresIn: 3600 }); // Obtenemos la url de la imagen
  return url; // Devolvemos la url de la imagen
}
