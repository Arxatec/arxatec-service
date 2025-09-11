// src/modules/auth/features/login/login_with_google/domain/login_with_google.use_case.ts
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
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${data.googleToken}` },
      });
      const userInfo = response.data;

      if (!userInfo || !userInfo.email) {
        throw new AppError(
          "Invalid Google token",
          HttpStatusCodes.UNAUTHORIZED.code
        );
      }

      let user = await this.loginGoogleRepository.getByEmail(userInfo.email);
      let isNewUser = false;

      if (!user) {
        const newUser = {
          email: userInfo.email,
          firstName: userInfo.given_name || "",
          lastName: userInfo.family_name || "",
          profileImage: userInfo.picture || "",
        };
        user = await this.loginGoogleRepository.createFromGoogle(newUser);
        isNewUser = true;
      }

      const token = generateToken({
        id: user.id,
        user_type: user.user_type ?? "client",
      });

      return {
        user: {
          id: user.id, // string
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        },
        token,
        isNewUser,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.log("[GOOGLE LOGIN ERROR]", error);
      throw new AppError(
        "Authentication failed",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }
  }
}
