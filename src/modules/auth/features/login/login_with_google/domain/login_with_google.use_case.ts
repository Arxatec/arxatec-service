import { generateToken } from "../../../../../../infrastructure/jwt";
import {
  LoginGoogleDTO,
  LoginGoogleResponseDTO,
} from "./login_with_google.dto";
import { LoginGoogleRepository } from "../data/login_with_google.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import axios from "axios";

export class LoginGoogleUseCase {
  constructor(private readonly loginGoogleRepository: LoginGoogleRepository) {}

  async execute(data: LoginGoogleDTO): Promise<LoginGoogleResponseDTO> {
    try {
      const url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
      const config = {
        headers: {
          Authorization: `Bearer ${data.googleToken}`,
        },
      };
      const response = await axios.get(url, config);
      const userInfo = response.data;

      if (!userInfo || !userInfo.email) {
        throw new AppError(
          "Invalid Google token",
          HttpStatusCodes.UNAUTHORIZED.code
        );
      }

      let user = await this.loginGoogleRepository.getEmail(userInfo.email);
      let isNewUser = false;

      if (!user) {
        const newUser = {
          email: userInfo.email,
          firstName: userInfo.given_name || "",
          lastName: userInfo.family_name || "",
          profileImage: userInfo.picture || "",
        };
        user = await this.loginGoogleRepository.createUserFromGoogle(newUser);
        isNewUser = true;
      }

      const token = generateToken({
        id: user.id,
        user_type: user.user_type,
      });

      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          profileImage: user.profile_image,
        },
        token,
        isNewUser,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Authentication failed",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }
  }
}
