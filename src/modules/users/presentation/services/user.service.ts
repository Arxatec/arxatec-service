import { UserRepository } from "../../data/repository/user.repository";
import { GetProfileResponseDTO } from "../../domain/dtos/get-profile.dto";
import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: number): Promise<GetProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        MESSAGES.USER.PROFILE_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.profile_image,
      userType: user.user_type,
      createdAt: user.creation_timestamp,
    };
  }
}
