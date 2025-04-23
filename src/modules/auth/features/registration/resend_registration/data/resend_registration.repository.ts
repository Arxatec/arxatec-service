import { redisClient } from "../../../../../../config/redis";

export interface ResendRegistrationRepository {
  getTemporaryUser(email: string): Promise<string | null>;
  createTemporaryCode(email: string, code: string): Promise<void>;
}

export class ResendRegistrationRepositoryImpl
  implements ResendRegistrationRepository
{
  async getTemporaryUser(email: string): Promise<string | null> {
    const temporaryUserDataRaw = await redisClient.get(
      `TEMPORARY_USER_REGISTRATION:${email}`
    );
    return temporaryUserDataRaw;
  }

  async createTemporaryCode(email: string, code: string) {
    const temporaryRegistrationCode = {
      email,
      code,
    };

    await redisClient.set(
      `TEMPORARY_REGISTRATION_CODE:${email}`,
      JSON.stringify(temporaryRegistrationCode),
      {
        EX: 15 * 60,
      }
    );
  }
}
