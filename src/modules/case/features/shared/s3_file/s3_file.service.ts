// modules/cases/feature/shared/s3_file/s3_file.service.ts
import {
  uploadFile,
  deleteFile,
  getSignedUrl,
} from "../../../../../infrastructure/aws";

export class S3FileService {
  async upload(file: Express.Multer.File, keyPrefix: string) {
    return await uploadFile(file, keyPrefix);
  }

  async remove(key: string) {
    return await deleteFile(key);
  }

  async getUrl(key: string) {
    return await getSignedUrl(key);
  }
}