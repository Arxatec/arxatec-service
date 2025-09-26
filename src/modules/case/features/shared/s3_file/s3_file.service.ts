// modules/cases/feature/shared/s3_file/s3_file.service.ts
import {
  uploadFile,
  deleteFile,
  getSignedUrl,
} from "../../../../../infrastructure/aws";

export class S3FileService {
  upload(file: Express.Multer.File, keyPrefix: string) {
    return uploadFile(file, keyPrefix);
  }

  remove(key: string) {
    return deleteFile(key);
  }

  getUrl(key: string) {
    return getSignedUrl(key);
  }
}
