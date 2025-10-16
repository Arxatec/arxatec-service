// src/modules/auth/features/login/login_with_facebook/presentation/login_with_facebook.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import passport from "../../../../../../config/passport";
import { postLoginWithFacebook } from "./login_with_facebook.controller";
import { loginWithFacebookCallback } from "./login_with_facebook.service";
import type { Profile as FacebookProfile } from "passport-facebook";
import type { AuthenticateOptions } from "passport";

export const loginFacebookRouter = Router();

loginFacebookRouter.post("/facebook", postLoginWithFacebook);

type FacebookAuthenticateOptions = AuthenticateOptions & {
  authType?: "rerequest" | "reauthenticate";
};

loginFacebookRouter.get(
  "/facebook",
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("facebook", {
      scope: ["public_profile", "email"],
      authType: "rerequest",
      session: false,
    } as FacebookAuthenticateOptions)(req, res, next)
);

loginFacebookRouter.get(
  "/facebook/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "facebook",
      { session: false },
      async (err: any, profile: FacebookProfile | false, _info?: any) => {
        const back = process.env.FRONT_URL || "http://localhost:5173";

        if (err || !profile) {
          return res.redirect(`${back}/oauth/callback?error=OAuthFailed`);
        }
        try {
          const result = await loginWithFacebookCallback(profile);
          const url =
            `${back}/oauth/callback` +
            `?token=${encodeURIComponent(result.token)}` +
            `&isNew=${result.isNewUser ? "1" : "0"}`;
          return res.redirect(url);
        } catch {
          return res.redirect(`${back}/oauth/callback?error=OAuthFailed`);
        }
      }
    )(req, res, next);
  }
);
