// src/modules/auth/features/login/login_with_google/presentation/login_with_google.service.ts
import axios from "axios";
import { generateToken } from "../../../../../../infrastructure/jwt";
import {
  LoginGoogleRepository,
  LoginGoogleRepositoryImpl,
} from "../data/login_with_google.repository";
import {
  LoginGoogleDTO,
  LoginGoogleResponseDTO,
} from "../domain/login_with_google.dto";

const repo: LoginGoogleRepository = new LoginGoogleRepositoryImpl();

export async function loginWithGoogleLegacy(
  data: LoginGoogleDTO
): Promise<LoginGoogleResponseDTO> {
  const url = "https://openidconnect.googleapis.com/v1/userinfo";
  const { data: userInfo } = await axios.get(url, {
    headers: { Authorization: `Bearer ${data.googleToken}` },
  });

  if (!userInfo?.email) {
    throw new Error("Invalid Google token");
  }

  let user = await repo.getByEmail(userInfo.email.toLowerCase());
  let isNewUser = false;

  if (!user) {
    user = await repo.createFromGoogle({
      email: userInfo.email.toLowerCase(),
      firstName: userInfo.given_name || "",
      lastName: userInfo.family_name || "",
      profileImage: userInfo.picture || "",
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

export async function loginWithGoogleCallback(
  profile: any
): Promise<LoginGoogleResponseDTO> {
  const email =
    profile?.emails?.[0]?.value?.toLowerCase() ??
    profile?._json?.email ??
    undefined;

  if (!email) throw new Error("Invalid Google profile: email missing");

  const firstName =
    profile?.name?.givenName ?? profile?._json?.given_name ?? "";
  const lastName =
    profile?.name?.familyName ?? profile?._json?.family_name ?? "";
  const profileImage =
    profile?.photos?.[0]?.value ?? profile?._json?.picture ?? "";

  let user = await repo.getByEmail(email);
  let isNewUser = false;

  if (!user) {
    user = await repo.createFromGoogle({
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
