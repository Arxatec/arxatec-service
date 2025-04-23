import { redisClient } from "../../../../../../config/redis";

export interface VerifyCodePasswordResetRepository {
  getTemporaryCode(email: string): Promise<string | null>;
  removeTemporaryCode(email: string): Promise<void>;
}

export class VerifyCodePasswordResetRepositoryImpl
  implements VerifyCodePasswordResetRepository
{
  async getTemporaryCode(email: string) {
    return await redisClient.get(`TEMPORARY_PASSWORD_RESET_CODE:${email}`);
  }

  async removeTemporaryCode(email: string) {
    await redisClient.del(`TEMPORARY_PASSWORD_RESET_CODE:${email}`);
  }
}
