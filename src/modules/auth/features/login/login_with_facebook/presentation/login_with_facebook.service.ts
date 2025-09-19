// src/modules/auth/features/login/login_with_facebook/presentation/login_with_facebook.service.ts
import axios from "axios";
import { generateToken } from "../../../../../../infrastructure/jwt";
import {
  LoginFacebookRepository,
  LoginFacebookRepositoryImpl,
} from "../data/login_with_facebook.repository";
import {
  LoginFacebookDTO,
  LoginFacebookResponseDTO,
} from "../domain/login_with_facebook.dto";

const repo: LoginFacebookRepository = new LoginFacebookRepositoryImpl();

export async function loginWithFacebookLegacy(
  data: LoginFacebookDTO
): Promise<LoginFacebookResponseDTO> {
  const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${data.facebookToken}`;
  const { data: userInfo } = await axios.get(url);

  if (!userInfo?.email) {
    throw new Error("Invalid Facebook token");
  }

  let user = await repo.getByEmail(userInfo.email.toLowerCase());
  let isNewUser = false;

  if (!user) {
    user = await repo.createFromFacebook({
      email: userInfo.email.toLowerCase(),
      firstName: userInfo.first_name || "",
      lastName: userInfo.last_name || "",
      profileImage: userInfo.picture?.data?.url || "",
    });
    isNewUser = true;
  }

  const token = generateToken({
    id: user.id,
    user_type: user.user_type ?? "client",
  });

  return {
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    token,
    isNewUser,
  };
}

export async function loginWithFacebookCallback(
  profile: any
): Promise<LoginFacebookResponseDTO> {
  const email =
    profile?.emails?.[0]?.value?.toLowerCase() ??
    profile?._json?.email ??
    undefined;

  if (!email) throw new Error("Invalid Facebook profile: email missing");

  const firstName =
    profile?.name?.givenName ?? profile?._json?.first_name ?? "";
  const lastName = profile?.name?.familyName ?? profile?._json?.last_name ?? "";
  const profileImage =
    profile?.photos?.[0]?.value ?? profile?._json?.picture?.data?.url ?? "";

  let user = await repo.getByEmail(email);
  let isNewUser = false;

  if (!user) {
    user = await repo.createFromFacebook({
      email,
      firstName,
      lastName,
      profileImage,
    });
    isNewUser = true;
  }

  const token = generateToken({
    id: user.id,
    user_type: user.user_type ?? "client",
  });

  return {
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    token,
    isNewUser,
  };
}
