// src/modules/auth/features/login/login_with_facebook/presentation/login_with_facebook.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import passport from "../../../../../../config/passport";
import { postLoginWithFacebook } from "./login_with_facebook.controller";
import { loginWithFacebookCallback } from "./login_with_facebook.service";

export const loginFacebookRouter = Router();

loginFacebookRouter.post(
  "/facebook",
  asyncHandler((req, res) => postLoginWithFacebook(req, res))
);

loginFacebookRouter.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

loginFacebookRouter.get("/facebook/callback", (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false },
    async (err, profile) => {
      if (err || !profile) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              req.path,
              { error: String(err ?? "OAuth failed") }
            )
          );
      }

      const result = await loginWithFacebookCallback(profile);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Login with Facebook successful",
            req.path,
            result
          )
        );
    }
  )(req, res, next);
});
