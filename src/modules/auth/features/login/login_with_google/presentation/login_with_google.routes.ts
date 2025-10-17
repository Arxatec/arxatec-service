// src/modules/auth/features/login/login_with_google/presentation/login_with_google.routes.ts
import { Router } from "express";
import passport from "../../../../../../config/passport";
import {
  postLoginWithGoogle,
  validateOAuthState,
} from "./login_with_google.controller";
import { loginWithGoogleCallback } from "./login_with_google.service";

export const loginGoogleRouter = Router();

/**
 * Legacy (POST): body { googleToken }
 * @openapi
 * /auth/login/google:
 *   post:
 *     tags: [Auth]
 *     summary: "Login user with Google (legacy body token)"
 *     description: "Autentica con access_token de Google y retorna JWT. Crea usuario si no existe."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [googleToken]
 *             properties:
 *               googleToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Login with Google successful"
 */
loginGoogleRouter.post("/google", postLoginWithGoogle);

/**
 * Redirect a Google (OIDC)
 * @openapi
 * /auth/login/google:
 *   get:
 *     tags: [Auth]
 *     summary: "Redirige a Google para autenticación"
 *     description: "Inicia el flujo OAuth con Google (redirect → callback)."
 *     responses:
 *       302:
 *         description: "Redirección a Google"
 */
loginGoogleRouter.get(
  "/google",
  (req, res, next) => validateOAuthState(req, res, next),
  (req, res, next) =>
    passport.authenticate("google", {
      scope: ["openid", "email", "profile"],
      session: false,
      state: typeof req.query.state === "string" ? req.query.state : undefined,
    })(req, res, next)
);

/**
 * Callback de Google (custom callback para responder JSON)
 * @openapi
 * /auth/login/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: "Callback de Google"
 *     description: "Google redirige aquí. Si es válido, se emite tu JWT y se responde con formato estándar."
 *     responses:
 *       200:
 *         description: "Login con Google exitoso"
 *       401:
 *         description: "Unauthorized"
 */
loginGoogleRouter.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, profile) => {
    if (err || !profile) {
      return res.redirect(
        `${process.env.FRONT_URL}/oauth/callback?error=OAuthFailed`
      );
    }

    const result = await loginWithGoogleCallback(profile);

    const url =
      `${process.env.FRONT_URL}/oauth/callback` +
      `?token=${encodeURIComponent(result.token)}` +
      `&isNew=${result.isNewUser ? "1" : "0"}`;
    console.log("[OAUTH REDIRECT →]", url);
    return res.redirect(url);
  })(req, res, next);
});
