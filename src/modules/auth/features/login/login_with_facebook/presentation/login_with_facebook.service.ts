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
  const url = `https://graph.facebook.com/me?fields=id,first_name,last_name,name,email,picture&access_token=${data.facebookToken}`;
  const { data: userInfo } = await axios.get(url);
  let email: string | undefined = userInfo?.email?.toLowerCase();
  const firstName: string = userInfo?.first_name ?? "";
  const lastName: string = userInfo?.last_name ?? "";
  const profileImage: string = userInfo?.picture?.data?.url ?? "";
  if (!email) email = `fb-${userInfo?.id}@example.local`;

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

export async function loginWithFacebookCallback(
  profile: any
): Promise<LoginFacebookResponseDTO> {
  let email: string | undefined =
    profile?.emails?.[0]?.value?.toLowerCase() ??
    profile?._json?.email?.toLowerCase();
  const firstName: string =
    profile?.name?.givenName ?? profile?._json?.first_name ?? "";
  const lastName: string =
    profile?.name?.familyName ?? profile?._json?.last_name ?? "";
  const profileImage: string =
    profile?.photos?.[0]?.value ?? profile?._json?.picture?.data?.url ?? "";

  if (!email && (profile as any)?._accessToken) {
    try {
      const r = await axios.get("https://graph.facebook.com/me?fields=email", {
        headers: { Authorization: `Bearer ${(profile as any)._accessToken}` },
      });
      if (r.data?.email) email = String(r.data.email).toLowerCase();
    } catch {}
  }

  if (!email) email = `fb-${profile?.id}@example.local`;

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
