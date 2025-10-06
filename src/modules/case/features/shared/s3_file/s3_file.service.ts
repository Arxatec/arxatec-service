// modules/cases/feature/shared/s3_file/s3_file.service.ts
import {
  uploadFile,
  deleteFile,
  getSignedUrl,
} from "../../../../../infrastructure/aws";

export async function uploadS3File(file: Express.Multer.File, keyPrefix: string) {
  return uploadFile(file, keyPrefix);
}

export async function removeS3File(key: string) {
  return deleteFile(key);
}

export async function getS3FileUrl(key: string) {
  return getSignedUrl(key);
}
